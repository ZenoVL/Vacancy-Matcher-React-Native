import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

export function Header({name} : { name : string|undefined}) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        backgroundColor: '#ffffff',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        paddingHorizontal: 20,
    },
    title: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: "center"
    },
});