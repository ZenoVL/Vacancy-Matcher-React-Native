import React, {useState, useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import {getLoggedInUser, getUserData} from "../services/UserService";
import {useRealtimeMessages} from "../services/ChatService";
import {Header} from "../components/Header";
import {Chat} from "../components/chat/Chat";
import {User} from "../models/User";
import { Loading } from '../components/Loading';
import { View } from 'react-native';
import FooterNavigation from "../components/NavigationFooter";

export function ChatView(props: { route: { params: { chatId: string; } } }): JSX.Element {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [user, setUser] = useState({ _id: '123', name: '', isAnonymous: false});

    let chatId = props.route.params.chatId.toString()
    const { rtmessages, premiseInfo, userInfo } = useRealtimeMessages(chatId);


    useEffect(() => {
        setMessages(rtmessages);
    }, [rtmessages]);

    useEffect(() => {
        const getUser = async () => {
            const loggedInUser = await getLoggedInUser() as User;
            setUser({_id: loggedInUser.uid, name: loggedInUser.name, isAnonymous: loggedInUser.isAnonymous});
        };
        getUser();
    }, []);

    return (
        <>
            <Header name={!userInfo.isAnonymous?userInfo.name:"anoniem"} />
            <Chat chatId={chatId} messages={messages} loggedInUser={user} tokens={userInfo.notificationTokens} username={!user.isAnonymous?user.name:"anoniem"}></Chat>
            <FooterNavigation/>
        </>
    );
}
