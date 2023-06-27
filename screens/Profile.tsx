import {useGetLoggedInUser} from "../hooks/useUsers";
import {ProfileNotLoggedIn} from "../components/profile/ProfileNotLoggedIn"
import {Loading} from "../components/Loading";
import {ScrollView, View} from "react-native";
import { ProfileEmail } from "../components/profile/ProfileEmail";
import { ProfileImage } from "../components/profile/ProfileImage";
import {ProfileDisplayName} from "../components/profile/ProfileDisplayName";
import {ProfilePhoneNumber} from "../components/profile/ProfilePhoneNumber";
import {ProfilePrivacy} from "../components/profile/ProfilePrivacy";
import {ProfileFunction} from "../components/profile/ProfileFunction";
import {ProfilePassword} from "../components/profile/ProfilePassword";
import {Button} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React, {useEffect} from "react";
import {ProfileOrganisation} from "../components/profile/ProfileOrganisation";
import {globalStyle} from "../styles/globalStyle";
import FooterNavigation from "../components/NavigationFooter";

export function Profile(){
    const {isLoading, isError, isLoggedIn, data, refetch} = useGetLoggedInUser()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(()=>{
        return () => {
            refetch()
        }
    },[])

    if(isLoading){
        return <><View style={globalStyle.loading}><Loading/></View><FooterNavigation/></>
    }

    if(isError){
        alert("het laden van het profiel is gelukt, probeer terug in te loggen")
    }

    if(!isLoggedIn){
        return <ProfileNotLoggedIn/>
    }

    return (
        <>
        <ScrollView>
            <View style={{marginTop: 60, padding: 10}}>
                        <ProfileImage image={data!.image}/>
                <View style={[globalStyle.ButtonContainer, {marginTop: 0}]}>
                    <Button icon={"logout"} mode={"contained"} style={[globalStyle.Button, {maxWidth: 400}]} onPress={()=>{navigation.replace("Logout")}}>Afmelden</Button>
                </View>
                        <ProfileEmail email={data!.email}/>
                        <ProfileDisplayName displayName={data!.name??""}/>
                        <ProfilePhoneNumber phoneNumber={data!.phoneNumber??""}/>
                        <ProfilePrivacy isAnonymous={data!.isAnonymous}/>
                        <ProfileFunction isOwner={data!.isOwner}/>
                        <ProfileOrganisation isOrganisation={data!.isOrganisation}/>
                        <ProfilePassword/>
            </View>
        </ScrollView>
            <FooterNavigation/>
        </>
    )
}
