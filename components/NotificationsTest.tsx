import {useEffect} from "react";
import * as Notifications from "expo-notifications";
import {Button} from "react-native-paper";
import {Alert, Platform, View} from "react-native";
import {useGetLoggedInUser} from "../hooks/useUsers";
import {Loading} from "./Loading";

export function NotificationsTest(){
    const {isLoading, isError, data} = useGetLoggedInUser()

    useEffect(()=>{
        const subscription = Notifications.addNotificationReceivedListener((notification)=>{
            console.log("NOTIFICATION RECEIVED")
            console.log(notification)
        })

        const subscription2 = Notifications.addNotificationResponseReceivedListener((response)=>{
            console.log("NOTIFICATION RESPONSE RECEIVED")
            console.log(response)
        })

        return ()=>{
            subscription.remove()
            subscription2.remove()
        }
    })

    if(isLoading){
        return <View style={{display: "flex", justifyContent: "center"}}><Loading/></View>
    }

    if(isError){
        Alert.alert("mislukt")
    }

    async function senPushNotificationHandler(){
        console.log(data?.notificationToken)

        fetch("https://exp.host/--/api/v2/push/send",{
            method: "post",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                to:data?.notificationToken,
                title: 'test - send from a device!',
                body: 'This is a test!'
            })
        })
    }

    function scheduleNotificationHandler(){
        Notifications.scheduleNotificationAsync({
            content:{
                title: 'My first local notification',
                body: 'This is the body of the notification.',
                data:{
                    userName: 'Max'
                }
            },
            trigger:{
                seconds: 5
            }
        })
    }

    return(
        <>
            <Button style={{marginTop: 60}} onPress={scheduleNotificationHandler}>Schedule notification</Button>
            <Button style={{marginTop: 60}} onPress={senPushNotificationHandler}>push notification</Button>
        </>
    )
}