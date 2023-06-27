import {getLoggedInUser, getUserData} from "./UserService";
import {
    getDatabase,
    orderByChild,
    startAfter,
    ref,
    query,
    get,
    equalTo,
    limitToFirst,
    DataSnapshot,
    child
} from "firebase/database";
import {PropertyDto} from "../models/dto/PropertyDto";
import {getFilteredPremises, getFirstChatFromProperty} from "./ChatService";
import {Premise} from "../models/Premise";
import {PremiseDto} from "../models/dto/PremiseDto";
import {User} from "../models/User";
import {getDownloadURL, getStorage, ref as refStorage} from "firebase/storage";


export async function getUserProperties() {
    const user = await getLoggedInUser();
    if (!user) {
        return null;
    }

    const db = getDatabase();
    let properties: PropertyDto[] = [];

    // Haal alle eigenschappen op
    const premises = await getFilteredPremises(db, user.uid);

    premises.forEach((premise) => {
        // Als de eigenaar overeenkomt met de gebruiker, voeg deze toe aan de array
        if (premise.properties.ownerId === user.uid) {
            properties.push({ id: premise.properties.OBJECTID.toString(), image: premise.properties.image, ownerId: premise.properties.ownerId, name: premise.properties.pva_straat + ' ' + premise.properties.pva_huisnr1 + (premise.properties.pva_huisnr2 ?  ' ' + premise.properties.pva_huisnr2 : '') + ', ' + premise.properties.pva_postcode});
        }
    });

    return properties;
}

interface GetPremisesWithOwnerProps{
    hasOwner:boolean
    size: number
    startAt: number
    state:string
    area: string
    type: string
    id?: string
}


export async function getPremisesWithOwner({hasOwner, size, startAt:idToStart, state, area, type, id}:GetPremisesWithOwnerProps) {
    const user = await getLoggedInUser();
    if (!user) {
        return Promise.resolve([]);
    }


    async function getProperties(sizeToStart:number) {
        let propertiesQuery

        if (id) {
            // Query voor het ophalen van alle eigenschappen met een eigenaar
            propertiesQuery = ref(getDatabase(), `Premises/${id}`);
        } else {
            propertiesQuery = query(
                ref(getDatabase(), 'Premises'),
                orderByChild('properties/OBJECTID'),
                startAfter(idToStart),
                limitToFirst(sizeToStart)
            );
        }

        const propertiesSnapshot = await get(propertiesQuery);

        const properties: Array<DataSnapshot> = []

        if (propertiesSnapshot.size === 0) {
            throw new Error("No More Rows")
        }

        if (!id)
            propertiesSnapshot.forEach((p) => {
                if ((hasOwner && !p.hasChild("properties/ownerId")) || (!hasOwner && p.hasChild("properties/ownerId"))) return;
                const pval = p.val();
                if (area !== '' && pval.properties.SHAPE_Area < parseInt(area)) return;
                if (state ? !pval.premise.properties.reg_aard.toLowerCase().includes(type.toLowerCase()) : false) return;
                if (state ? !pval.properties.state.toLowerCase().includes(state.toLowerCase()) : false) return;
                properties.push(p)
            })
        else properties.push(propertiesSnapshot)

        return properties;
    }

    let properties:Array<DataSnapshot> = []
    let sizeToGet:number = size

    do{
        try{
            properties = await getProperties(sizeToGet)
        }catch (e) {
            console.log(e)
            break
        }
        sizeToGet += 50
    }while(properties.length<1)

    // Lijst met alle premises waarvan er een eigenaar is
    const premises: PremiseDto[] = [];

    const promises: Promise<void>[] = [];

    properties.forEach((childSnapshot) => {
        const premisedto = { premise: childSnapshot.val() as Premise } as PremiseDto;
        premisedto.canChat = !user.isOwner;

        if (hasOwner&&premisedto.premise.properties.ownerId === user.uid) premisedto.isOwner = true;
        const chatPromise = getFirstChatFromProperty(premisedto.premise.properties.OBJECTID).then((chat) => {
            premisedto.hasChat = chat.id;
        }).catch(() => {
            // Handle error when chat is not found
        });

        // Check of de premise al aan favorieten is toegevoegd door de huidige gebruiker
        const favoritesQuery = query(
            ref(getDatabase(), `Favorites`),
            orderByChild('id'),
            equalTo(premisedto.premise.properties.OBJECTID + '_' + user.uid)
        );

        const favoritesPromise = get(favoritesQuery).then((favoritesSnapshot) => {
            if (favoritesSnapshot.exists()) {
                premisedto.isFavorite = true;
            } else {
                premisedto.isFavorite = false;
            }

            // Update het aantal keren dat de premise aan favorieten is toegevoegd
            const favoritesCountQuery = query(
                ref(getDatabase(), `Favorites`),
                orderByChild('premiseId'),
                equalTo(premisedto.premise.properties.OBJECTID.toString())
            );

            const chatId = user.uid + '_' + premisedto.premise.properties.OBJECTID;

            // Check of de premise al aan favorieten is toegevoegd door de huidige gebruiker
            const chatQuery = query(
                ref(getDatabase(), `Chats`),
                orderByChild('id'),
                equalTo(chatId)
            );

            const chatPromise = get(chatQuery).then((chatSnapchot) => {
                if (chatSnapchot.exists()) {
                    premisedto.hasChat = chatId;
                }

                promises.push(chatPromise, chatPromise);

            });

            return get(favoritesCountQuery).then((favoritesCountSnapshot) => {
                let favoritesCount = 0;
                favoritesCountSnapshot.forEach(() => {
                    favoritesCount++;
                });
                premisedto.favoritesCount = favoritesCount;

                const premisesRef = refStorage(getStorage(), `premisesImages/${premisedto.premise.properties.OBJECTID}/0`);

                getDownloadURL(premisesRef)
                    .then((r:string)=>{
                        premisedto.premise.properties.image = r
                    })
                    .catch((reason)=>{
                        premisedto.premise.properties.image = 'https://firebasestorage.googleapis.com/v0/b/vacancy-matcher-3musketeers.appspot.com/o/default%2Fimages%2Fpremise%20default.gif?alt=media&token=3e7806fa-0524-4d9b-8d08-5f0bf0b9afa5'
                    })

                premisedto.premise.properties.image = premisedto.premise.properties.image??'https://firebasestorage.googleapis.com/v0/b/vacancy-matcher-3musketeers.appspot.com/o/default%2Fimages%2Fpremise%20default.gif?alt=media&token=3e7806fa-0524-4d9b-8d08-5f0bf0b9afa5'

                premises.push(premisedto);
            });
        });

        promises.push(chatPromise, favoritesPromise);
    });

    await Promise.all(promises);

    return premises??[];
}

export async function getUsersWithFavoritePremise(propertyId: string): Promise<User[]> {
    const favoritesRef = ref(getDatabase(), 'Favorites');
    const favoritesQuery = query(
        favoritesRef,
        orderByChild('premiseId'),
        equalTo(propertyId.toString())
    );

    const userPromises: Promise<User>[] = [];

    const favoritesPromise = get(favoritesQuery).then((favoritesSnapshot) => {
        favoritesSnapshot.forEach((favoriteSnapshot) => {
            const favorite = favoriteSnapshot.val();
            const userPromise = getUserData(favorite.userId);
            userPromises.push(userPromise);
        });
    });

    await favoritesPromise;

    return Promise.all(userPromises);
}