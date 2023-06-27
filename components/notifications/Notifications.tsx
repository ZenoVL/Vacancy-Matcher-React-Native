import {useEffect} from "react";
import * as Notification from "expo-notifications";
import {Alert, Platform} from "react-native";

interface NotificationsWebProps{
    children: JSX.Element
}

export function Notifications({children}:NotificationsWebProps){
    useEffect(()=>{
        async function configurePushNotifications(){
            const { status } = await Notification.getPermissionsAsync()
            let finalStatus = status

            if(finalStatus !== 'granted'){
                const { status } = await Notification.requestPermissionsAsync()
                finalStatus = status
            }

            if(finalStatus !== 'granted'){
                alert("Sta meldingen toe voor deze app")
                return
            }

            const pushTokenData = await Notification.getExpoPushTokenAsync()
            console.log(pushTokenData)

            if(Platform.OS === "android"){
                Notification.setNotificationChannelAsync('default',{
                    name: 'default',
                    importance: Notification.AndroidImportance.DEFAULT
                })
            }
        }

        configurePushNotifications()
    },[])

    return <>{children}</>
}