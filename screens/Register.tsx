import {Alert, Platform, Text, View} from 'react-native'
import {RegisterUserDto} from "../models/dto/RegisterUserDto";
import {RegisterForm} from "../components/register/RegisterForm";
import {useRegisterUser} from "../hooks/useUsers";
import {checkRegisterUserValid} from "../services/UserService";
import {BackButton} from "../components/BackButton";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {AlertAllPlatforms} from "../components/AlertAllPlatforms";
import {Loading} from "../components/Loading";
import {Button, Dialog, Portal} from "react-native-paper";
import {useEffect, useState} from "react";
import * as Notifications from "expo-notifications";
import FooterNavigation from "../components/NavigationFooter";

function onRegisterSuccess(navigation:NativeStackNavigationProp<RootStackParamList>){
    navigation.reset({
        index: 1,
        routes: [
            {name: 'Map'},
            {name: 'Profile'}
        ]
    })
}

export function Register(){
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [isValid, setIsValid] = useState<boolean>(true)
    const {isLoading: isRegisterLoading, isError: isRegisterError, mutate} = useRegisterUser({onSuccess: ()=>onRegisterSuccess(navigation)})

    const addItem = (data: RegisterUserDto) => {
        if(checkRegisterUserValid(data)){
            setIsValid(true)
            mutate(data);
        }
        else{
            setIsValid(false)
        }
    };

    if(isRegisterLoading){
        return <><View style={{flex: 1, justifyContent:"center"}}><Loading/></View><FooterNavigation/></>
    }

    if(isRegisterError||!isValid){
        alert("Het registreren van de gebruiker is mislukt")
    }

    return(
        <>
            <RegisterForm onSubmit={addItem}/>
            <FooterNavigation/>
        </>
    )
}