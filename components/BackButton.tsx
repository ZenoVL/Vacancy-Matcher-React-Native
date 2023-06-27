import {Image, Pressable, StyleSheet} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

export function BackButton(){
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    return (
        <>
            <Pressable style={styles.buttonContainer} onPress={()=>navigation.goBack()}>
                <Image source={{uri: "https://cdn-icons-png.flaticon.com/512/93/93634.png"}} style={styles.buttonIcon}/>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    buttonContainer:{
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: 2,
        margin: 30,
        padding: 10
    },
    buttonIcon:{
        width: 50,
        height: 50
    }
})