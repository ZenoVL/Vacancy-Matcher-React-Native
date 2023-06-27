import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {MessageDto} from "../models/dto/MessageDto";
import {PropertyDto} from "../models/dto/PropertyDto";
import {getUserProperties} from "../services/PropertiesService";
import {RootStackParamList} from "../App";
import {getUserChatsWithLastMessage} from "../services/ChatService";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ChatItem} from "../components/chat/ChatItem";
import {PropertyPicker} from "../components/chat/PropertyPicker";
import {Loading} from "../components/Loading";
import FooterNavigation from "../components/NavigationFooter";
import {globalStyle} from "../styles/globalStyle";
import {useGetLoggedInUser} from "../hooks/useUsers";
import {Button} from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, 'ChatOverview'>;

export function ChatOverview({route, navigation}: Props): JSX.Element {
    const [selectedProperty, setSelectedProperty] = useState<string | undefined>(undefined);
    const [properties, setProperties] = useState<PropertyDto[] | null>(null);
    const [userChatsWithLastMessage, setUserChatsWithLastMessage] = useState<MessageDto[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {isLoading: isLoadingUser, isError:isErrorUser, data:loggedInUser} = useGetLoggedInUser()

    if(isLoadingUser){
        return <><View style={globalStyle.loading}><Loading/></View><FooterNavigation/></>
    }

    if(isErrorUser){
        alert("Laden van chats mislukt")
    }

    if(loggedInUser===undefined||loggedInUser===null){
        return <><View style={{flex: 1, justifyContent: "center", alignItems: "center"}}><Text>Meld u aan om dit scherm te kunnen zien</Text><Button icon={"login"} mode={"contained"} style={[globalStyle.Button]} onPress={() => navigation.navigate("Login")}>Aanmelden</Button></View><FooterNavigation/></>
    }

    const filteredMessagesMemoized = useMemo(() => {
        if (userChatsWithLastMessage) {
            const chatIds = new Set<string>();
            const filteredMessages = userChatsWithLastMessage.filter((messageDto) => {
                if (!selectedProperty || messageDto.propertyId === selectedProperty) {
                    if (!chatIds.has(messageDto.chatId)) {
                        chatIds.add(messageDto.chatId);
                        return true;
                    }
                }
                return false;
            });

            setIsLoading(false)
            return filteredMessages;
        }
        return null;
    }, [selectedProperty, userChatsWithLastMessage]);

    useEffect(() => {
        getUserProperties().then((properties) => {
            setSelectedProperty(undefined);
            setProperties(properties);
        });

        getUserChatsWithLastMessage().then((userChatsWithLastMessage) => {
            setUserChatsWithLastMessage(userChatsWithLastMessage);
        });

        const intervalId = setInterval(() => {
            getUserChatsWithLastMessage().then((userChatsWithLastMessage) => {
                setUserChatsWithLastMessage(userChatsWithLastMessage);
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    if (isLoading) {
        return <><View style={globalStyle.loading}><Loading/></View><FooterNavigation/></>
    }

    return (
        <>
            <View style={styles.container}>
                <PropertyPicker
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(value: string | undefined) => setSelectedProperty(value)}
                />
                <ScrollView>
                    <View style={styles.chatListContainer}>
                        {filteredMessagesMemoized?.length ? filteredMessagesMemoized.map(({chatId, ...rest}) => (
                            <ChatItem key={chatId} messageDto={{chatId, ...rest}}/>
                        )) : (
                            <Text style={styles.noChatText}>Geen berichten gevonden</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
            <FooterNavigation/>
        </>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 60
    },
    chatListContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatItemLastMessage: {
        fontSize: 14,
    },
    chatItemDateContainer: {
        alignItems: 'flex-end',
    },
    chatItemDate: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    chatItemUnreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
    },
    noChatText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 20,
    },
});
