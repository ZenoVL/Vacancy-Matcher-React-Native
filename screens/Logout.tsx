import {useLogoutUser} from "../hooks/useUsers";
import {Alert, View, Text, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Loading} from "../components/Loading";
import { Button } from "react-native-paper";
import {globalStyle} from "../styles/globalStyle";
import FooterNavigation from "../components/NavigationFooter";

type Props = NativeStackScreenProps<RootStackParamList, 'Logout'>;

export function Logout({route, navigation}:Props){
    const {isLoading, isError} = useLogoutUser()

    if(isLoading){
        return <><View style={{flex: 1, justifyContent:"center"}}><Loading/></View><FooterNavigation/></>
    }

    if(isError){
        alert("het afmelden is mislukt, probeer het later opnieuw")
    }

    return (<>
            <View style={styles.container}>
                <Text>Je bent succesvol afgemeld.</Text>
                <View style={globalStyle.ButtonContainer}>
                    <Button icon={"home"} mode={"contained"} onPress={()=>{navigation.reset({index: 0, routes: [{name: "Map"}]})}} style={globalStyle.Button}>Terug naar start</Button>
                    <Button icon={"login"} mode={"contained"} onPress={()=>{navigation.replace("Login")}} style={globalStyle.Button}>Aanmelden</Button>
                </View>
            </View>
            <FooterNavigation/>
    </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: 10,
        justifyContent: "center",
        alignItems: "center"
    },
})