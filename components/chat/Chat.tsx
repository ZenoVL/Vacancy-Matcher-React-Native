import { Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {StyleSheet} from "react-native";
import {Bubble, GiftedChat, IMessage, Send, User} from "react-native-gifted-chat";
import {addNewMessage} from "../../services/ChatService";
import {Message} from "../../models/Message";
import {useSendNotification} from "../../hooks/useNotifications";
import { IconButton } from "react-native-paper";

interface ChatProps {
    chatId: string;
    messages: IMessage[];
    loggedInUser: User;
    username:string
    tokens:Array<string>
}

export function Chat({chatId, messages, loggedInUser, username, tokens}:ChatProps){
    const inverted = false;
    const [user, setUser] = useState(loggedInUser);
    const {mutate:sendNotification} = useSendNotification()

    const onSend = async (newMsg: IMessage[]) => {
        newMsg.forEach((imsg) => {
            let message : Message = {
                id: imsg._id.toString(),
                isRead: false,
                content: imsg.text,
                createdAt: new Date(imsg.createdAt).getTime().toString(),
                chatId:  chatId,
                senderId: loggedInUser._id.toString()
            }
            addNewMessage(message);
            sendNotification({to: tokens, title:'bericht van '+username,body: imsg.text})
        });
    };

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#000'
                    },
                    right: {
                        backgroundColor: '#000',
                        borderWidth: 1,
                        borderColor: '#000'
                    }
                }}
                textStyle={{
                    left: {
                        color: '#000'
                    },
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    };

    const renderSend = (props: any) => {
        return (
            <Send {...props}>
                <View style={{
                    width: 60,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 5,
                    marginRight: 10
                }}>
                    <IconButton
                        icon="send"
                        size={20}
                    />
                </View>
            </Send>
        );
    };

    useEffect(() => {
        setUser(loggedInUser)
    }, [messages]);

    return (
        <>
            <GiftedChat {...{ messages, onSend, user, inverted, renderBubble, renderSend}} />
        </>
    )
}


const styles = StyleSheet.create({
})
