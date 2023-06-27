import { Image, Text, View, StyleSheet } from "react-native";
import {useState} from "react";
import {LoginUserDto} from "../../models/dto/LoginUserDto";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../../App";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useHorizontalScale} from "../../hooks/useDimensions";
import {FormFieldText} from "../form/FormFieldText";
import {FormFieldButton} from "../form/FormFieldButton";
import {Button, TextInput} from "react-native-paper";
import {globalStyle} from "../../styles/globalStyle";

interface LoginFormProps {
    onSubmit: (data: LoginUserDto) => void;
}

export function LoginForm({onSubmit}:LoginFormProps){
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const _onSubmit = (data: LoginUserDto) => {
        onSubmit(data);
        reset()
    };

    const reset = ()=>{
        setEmail("")
        setPassword("")
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Aanmelden</Text>
                <TextInput label={"Email"} keyboardType={"email-address"} style={globalStyle.textInput} value={email} onChangeText={setEmail}/>
                <TextInput label={"Wachtwoord"} keyboardType={"default"} style={globalStyle.textInput} secureTextEntry={true} value={password} onChangeText={setPassword}/>
                <View style={styles.flexRow}>
                    <Button mode={"contained"} onPress={()=>{_onSubmit({email, password})}} icon={"login"} style={globalStyle.Button}>Aanmelden</Button>
                    <Button mode={"contained"} onPress={reset} icon={"close"} style={globalStyle.Button}>Leegmaken</Button>
                </View>
                <View style={styles.flexRow}>
                    <Text>Nog geen account? </Text>
                    <Text style={styles.link} onPress={()=>
                    {
                        navigation.replace("Register")
                    }}>Registreer hier</Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent:"center",
        padding: 30,
    },
    textInput:{
        width: "100%",
        marginBottom: 10
    },
    link:{
        color: "orange"
    },
    flexRow:{
        padding: 5,
        flexDirection:"row",
    },
    title:{
        fontSize: 40,
        fontWeight:"bold",
        marginBottom: 20
    },
})