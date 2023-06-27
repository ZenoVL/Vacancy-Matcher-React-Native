import {LoginForm} from "../components/login/LoginForm";
import {useLoginUser} from "../hooks/useUsers";
import {LoginUserDto} from "../models/dto/LoginUserDto";
import {BackButton} from "../components/BackButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useNavigation} from "@react-navigation/native";
import {Loading} from "../components/Loading";
import {AlertAllPlatforms} from "../components/AlertAllPlatforms";
import {View} from "react-native";
import {useSendNotification} from "../hooks/useNotifications";
import FooterNavigation from "../components/NavigationFooter";
import {globalStyle} from "../styles/globalStyle";

function onLoginSuccess(navigation:NativeStackNavigationProp<RootStackParamList>){
    navigation.reset({
        index: 1,
        routes: [
            {name: 'Map'},
            {name: 'Profile'}
        ]
    })
}

export function Login(){
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const {isLoading: isLoginLoading, isError: isLoginError, mutate, error} = useLoginUser({onSuccess:()=>onLoginSuccess(navigation)});

    const addItem = (data: LoginUserDto) => {
        mutate(data)
    };

    if(isLoginLoading){
        return <><View style={globalStyle.loading}><Loading/></View><FooterNavigation/></>
    }

    if(isLoginError){
        alert(error)
    }

    return(
        <>
            <LoginForm onSubmit={(user)=>{addItem(user)}}/>
            <FooterNavigation/>
        </>
    )
}