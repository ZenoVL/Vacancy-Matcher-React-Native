// Voeg een nieuw chatbericht toe
import {Message} from "../models/Message";
import {getLoggedInUser, getUserData} from "./UserService";
import {child, get, getDatabase, onValue, ref, remove, set, query, orderByChild, equalTo, startAt, endAt, push} from "firebase/database";
import {MessageDto} from "../models/dto/MessageDto";
import {User} from "../models/User";
import {Database} from "@firebase/database";
import {ChatMessagesDto} from "../models/dto/ChatMessagesDto";
import {IMessage} from "react-native-gifted-chat";
import {getPropertyData} from "./PremisesService";
import {useCallback, useEffect, useState} from "react";
import {Chat} from "../models/Chat";
import {Premise} from "../models/Premise";
import {UserFavorite} from "../models/UserFavorite";


export async function addNewMessage(message: Message) {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    await set(ref(db, "Messages/" + message.id), {
        id: message.id,
        isRead: message.isRead,
        content: message.content,
        createdAt: message.createdAt,
        chatId: message.chatId,
        senderId: message.senderId,
    });
}

export async function addNewChatWithMessage(propertyId: number | null, content: string) {
    const user = await getLoggedInUser();
    if (!user || !propertyId) {
        return null;
    }

    const db = getDatabase();

    const newMessageRef = push(ref(db, "Messages"));
    const messageId = newMessageRef.key as string;
    const newChatRef = ref(db, `Chats`);

    // Maak eerst de nieuwe chat aan
    const chat: Chat = {
        id: user.uid + '_' + propertyId,
        searcherId: user.uid,
        propertyId: propertyId.toString(),
    };

    // Maak vervolgens een nieuw bericht aan
    const message: Message = {
        id: messageId,
        isRead: false,
        content: content,
        createdAt: Date.now().toString(),
        chatId: chat.id,
        senderId: user.uid,
    };

    await set(newMessageRef, message);
    await set(child(newChatRef, chat.id), chat);

    return chat.id;
}



export async function addNewFavoritePremise(propertyId: number) {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    const newFavoriteRef = ref(db, `Favorites`);

    const favorite: UserFavorite = {
        id: propertyId + '_' + user.uid,
        userId: user.uid,
        premiseId: propertyId.toString(),
        createdAt: Date.now().toString(),
    };

    await set(child(newFavoriteRef, favorite.id), favorite);
}

export async function removeFavoritePremise(propertyId: number) {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    await remove(ref(db, "Favorites/" + propertyId + '_' + user.uid));
}




// Verwijder een chatbericht
export async function removeMessage(messageId: string) {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    await remove(ref(db, "Messages/" + messageId));
}

export async function removeChat(chatId: string) {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    await remove(ref(db, "Chats/" + chatId));
}

export async function getUserChatsWithLastMessage(): Promise<MessageDto[]> {
    const user = await getLoggedInUser();
    if (!user) {
        throw new Error('User not logged in');
    }

    const db = getDatabase();
    const filteredProperties = await getFilteredPremises(db, user.uid);
    const filteredChatsProperties = await getFilteredChats(db, filteredProperties);
    const filteredChatsUser = await getChatsWithUser(db, user.uid);

    const filteredChats = [...filteredChatsProperties, ...filteredChatsUser];

    const messagesPromises = filteredChats.map(async chat => {
        const lastMessageData = await getLastMessageByChatId(db, chat.id);
        const premiseData = await getPropertyData(chat.propertyId);

        let otherUser: string = '';
        if (user.uid === chat.searcherId) {
            otherUser = `${premiseData!.properties.pva_straat} ${premiseData!.properties.pva_huisnr1} ${(premiseData.properties.pva_huisnr2 ?  ' ' + premiseData.properties.pva_huisnr2 : '')}, ${premiseData!.properties.pva_postcode}`;
        } else {
            const searcherData = await getUserData(chat.searcherId);
            otherUser = !searcherData!.isAnonymous?searcherData!.name:"anoniem";
        }

        const isRead = lastMessageData!.isRead;

        return {
            chatId: chat.id,
            propertyId: chat.propertyId,
            name: otherUser,
            lastMessage: lastMessageData!.content,
            lastMessageTime: lastMessageData!.createdAt,
            isRead: isRead,
            image: premiseData!.properties.image,
        };
    });

    const messages = await Promise.all(messagesPromises);
    messages.sort((a, b) => {
        const timestampA = new Date(parseInt(a.lastMessageTime)).getTime();
        const timestampB = new Date(parseInt(b.lastMessageTime)).getTime();
        return timestampB - timestampA;
    });

    return messages;
}

export async function getFilteredPremises(db: any, ownerId: string) {
    // Query voor het ophalen van alle eigenschappen die eigendom zijn van de ingelogde gebruiker
    const propertiesQuery = query(
        ref(db, 'Premises'),
        orderByChild('properties/ownerId'),
        equalTo(ownerId)
    );
    const propertiesSnapshot = await get(propertiesQuery);

    // Lijst met alle IDs van eigenschappen die eigendom zijn van de ingelogde gebruiker
    const filteredProperties: Premise[] = [];
    propertiesSnapshot.forEach(childSnapshot => {
        filteredProperties.push(childSnapshot.val()!);
    });

    const sortedPremises = [...filteredProperties].sort(
        (a, b) => a.properties.OBJECTID - b.properties.OBJECTID
    );

    return sortedPremises;
}

async function getFilteredChats(db: any, premises: Premise[]) {
    if (premises.length == 0) return [];

    const chatsRef = ref(db, 'Chats');
    premises = premises.sort()

    let premiseSnapshots : Chat[] = [];

    for (const premise of premises) {
        const chatsQuery = query(
            chatsRef,
            orderByChild('propertyId'),
            equalTo(premise.properties.OBJECTID.toString())
        );
        const chatsSnapshot = (await get(chatsQuery)).val();

        if (chatsSnapshot) {
            premiseSnapshots = [...premiseSnapshots, ...(Object.values(chatsSnapshot) as Chat[])]
        }
    }

    return premiseSnapshots;
}


async function getChatsWithUser(db: any, userId: string): Promise<any[]> {
    const chatsRef = ref(db, 'Chats');
    const chatsQuery = query(
        chatsRef,
        orderByChild('searcherId'),
        equalTo(userId),
    );

    const chatsSnapshot = await get(chatsQuery);

    // Map chatsnapshot naar een array van ChatDto-objecten
    const filteredChats = Object.values(chatsSnapshot.val() || {})
        .map((chat: any) => ({
            id: chat.id,
            propertyId: chat.propertyId,
            searcherId: chat.searcherId,
        }));
    return filteredChats;
}

export async function getFirstChatFromProperty(propertyId: number): Promise<any | null> {
    const db = getDatabase();
    const chatsRef = ref(db, 'Chats');
    const chatsQuery = query(
        chatsRef,
        orderByChild('propertyId'),
        equalTo(propertyId),
    );

    const chatsSnapshot = await get(chatsQuery);

    // Map chatsnapshot naar een array van ChatDto-objecten
    const filteredChats = Object.values(chatsSnapshot.val() || {})
        .map((chat: any) => ({
            id: chat.id,
            propertyId: chat.propertyId,
            searcherId: chat.searcherId,
        }));

    // Retourneer enkel het eerste ChatDto-object uit de array
    return filteredChats.length > 0 ? filteredChats[0] : null;
}









async function getLastMessageByChatId(db: Database, chatId: string): Promise<Message | null> {
    const messagesRef = query(
        ref(db, 'Messages'),
        orderByChild('chatId'),
        equalTo(chatId)
    );
    const messagesSnapshot = await get(messagesRef);

    let lastMessageData: Message | null = null;

    messagesSnapshot.forEach((doc) => {
        const message = doc.val() as Message;
        if (message.chatId === chatId && (!lastMessageData || message.createdAt > lastMessageData.createdAt)) {
            lastMessageData = message;
        }
    });

    return lastMessageData;
}


export function convertToGiftedChatMessages(messages: ChatMessagesDto[]): IMessage[] {
    return messages.map((message) => {
        return {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user
        };
    });
}


export function useRealtimeMessages(chatId: string) {
    const db = getDatabase();

    const [rtmessages, setMessages] = useState<IMessage[]>([]);
    const [premiseInfo, setPremiseInfo] = useState<Premise>();
    const [userInfo, setUserInfo] = useState<User>({
        isOrganisation: false, isRemoved: false, organisationName: "", reasonForRemoval: "",
        email: "",
        image: "",
        isAnonymous: false,
        isOwner: false,
        password: "",
        phoneNumber: "",
        uid: "",
        name: '',
        notificationTokens: [""]
    });

    const handleSnapshot = useCallback(async (snapshot: any) => {
        const chatQuery = query(ref(db, 'Chats'), orderByChild('id'), equalTo(chatId));
        const chatSnapshot = await get(chatQuery);
        const chat = (Object.values(chatSnapshot.val()) as Chat[])[0];
        const premise = await getPremiseData(db, chat.propertyId);
        setPremiseInfo(premise);

        const loggedInUser = await getLoggedInUser() as User;
        const userInfo = await getUserInfo(db, loggedInUser, chat, premise);
        setUserInfo(userInfo);

        const messagesData = snapshot.val();
        if (!messagesData) return;
        const resolvedMessages = await getResolvedMessages(db, messagesData, chatId);
        const giftedChatMessages = convertToGiftedChatMessages(resolvedMessages.filter(Boolean) as ChatMessagesDto[]);
        giftedChatMessages.sort((a, b) => (a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt) - (b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt)); // sort messages by createdAt
        setMessages(giftedChatMessages);
    }, [chatId, setMessages]);

    useEffect(() => {
        const db = getDatabase();
        const messagesRef = ref(db, 'Messages');
        const chatMessagesQuery = query(messagesRef, orderByChild('chatId'), equalTo(chatId));
        const unsubscribe = onValue(chatMessagesQuery, handleSnapshot);
        return () => unsubscribe();
    }, [chatId, handleSnapshot]);

    return { rtmessages, premiseInfo, userInfo };
}

async function getPremiseData(db: any, propertyId: string): Promise<Premise> {
    const premiseSnapshot = await get(child(ref(db), `Premises/${propertyId}`));
    return premiseSnapshot.val();
}

async function getUserInfo(db: any, loggedInUser: User, chat: Chat, premise: Premise): Promise<User> {
    if (!loggedInUser.isOwner) {
        const ownerPromise = getUserData(premise.properties.ownerId);
        const [owner] = await Promise.all([ownerPromise]);
        return owner;
    } else {
        const searcherPromise = getUserData(chat.searcherId);
        const [searcher] = await Promise.all([searcherPromise]);
        return searcher;
    }
}

async function getResolvedMessages(db: any, messagesData: any, chatId: string): Promise<IMessage[]> {
    const messages = Object.keys(messagesData).map(async (key) => {
        const messageData = messagesData[key];
        if (messageData.chatId === chatId) {
            const sender: User = await getUserData(messageData.senderId);
            return {
                _id: key,
                text: messageData.content,
                user: {
                    _id: messageData.senderId,
                    name: sender.name,
                    avatar: sender.image,
                },
                createdAt: new Date(parseInt(messageData.createdAt)),
            };
        }
    });
    const resolvedMessages = await Promise.all(messages);
    return resolvedMessages.filter(Boolean) as IMessage[];
}