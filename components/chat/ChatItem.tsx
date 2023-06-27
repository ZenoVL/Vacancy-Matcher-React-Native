import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import {MessageDto} from "../../models/dto/MessageDto";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../App";

function formatMessage(message: string) {
    return message.length > 50 ? `${message.substring(0, 50)}...` : message;
}

function formatDate(date: string) {
    const now = moment();
    const messageDate = moment(new Date(parseInt(date)));
    if (now.diff(messageDate, 'days') < 1) {
        return messageDate.format('Humm');
    } else {
        return messageDate.format('D/M/YYYY');
    }
}

type Props = {
    messageDto: MessageDto;
};

export function ChatItem({ messageDto }: Props): JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    try {

        return (
            <TouchableOpacity
                key={messageDto.chatId}
                style={styles.chatItemContainer}
                onPress={() => navigation.navigate('ChatView', {chatId: messageDto.chatId})}
            >
                {messageDto.image && (
                    <Image source={{uri: messageDto.image}} style={styles.chatItemImage}/>
                )}
                <View style={styles.chatItemContent}>
                    <Text style={styles.chatItemName}>{messageDto.name}</Text>
                    <Text style={styles.chatItemLastMessage}>
                        {formatMessage(messageDto.lastMessage)}
                    </Text>
                </View>
                <View style={styles.chatItemDateContainer}>
                    <Text style={styles.chatItemDate}>
                        {formatDate(messageDto.lastMessageTime)}
                    </Text>
                    {!messageDto.isRead && <View style={styles.chatItemUnreadIndicator}/>}
                </View>
            </TouchableOpacity>
        );
    } catch { return <></>}
}

const styles = StyleSheet.create({
    chatItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
        borderColor: '#000',
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    chatItemImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    chatItemContent: {
        flex: 1,
    },
    chatItemName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    chatItemLastMessage: {
        color: '#555',
    },
    chatItemDateContainer: {
        alignItems: 'flex-end',
    },
    chatItemDate: {
        color: '#555',
    },
    chatItemUnreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        marginTop: 5,
    },
});
