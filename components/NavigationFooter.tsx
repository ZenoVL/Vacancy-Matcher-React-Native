import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useGetLoggedInUser} from "../hooks/useUsers";

export default function FooterNavigation() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [containerStyle, setContainerStyle] = useState([styles.darkContainer]);
    const [iconStyle, setIconStyle] = useState([styles.icon]);
    const {isLoading, isError, isLoggedIn, data} = useGetLoggedInUser()

    useEffect(() => {
        setContainerStyle(data?.isOwner ? [styles.container, styles.darkContainer] : [styles.container]);
        setIconStyle(data?.isOwner ? [styles.darkIcon] : [styles.icon]);

    }, [data?.isOwner]);

    return (
        <View style={containerStyle}>
            <Ionicons
                name="map-outline"
                size={30}
                onPress={() => navigation.navigate('Map' as any)}
                style={iconStyle}
            />
            <Ionicons
                name="chatbox-outline"
                size={30}
                onPress={() => navigation.navigate('ChatOverview')}
                style={iconStyle}
            />
            <Ionicons
                name="list-outline"
                size={30}
                onPress={() => navigation.navigate('PropertyList' as any)}
                style={iconStyle}
            />
            <Ionicons
                name="person-outline"
                size={30}
                onPress={() => navigation.navigate('Profile')}
                style={iconStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#eee',
        height: 50,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        zIndex: -2
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    icon: {
        color: '#555',
    },
    darkIcon: {
        color: '#eee',
    },
});
