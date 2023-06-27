import {useMutation, useQuery} from "react-query";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";

export function useGetToken(){
    const {isLoading, isError, data: token} = useQuery(["getToken"], async () => {
        if(Platform.OS !== "web"){
            return await Notifications.getExpoPushTokenAsync({experienceId: "@thethreemusketeers/vacancy-matcher-app-react-native"})
        }

        return {data:""}
    })

    return {
        isLoading,
        isError,
        token
    }
}

interface SendPushNotificationProps{
    to: Array<string>
    title: string
    body: string
}

async function sendPushNotificationHandler({to, title, body}:SendPushNotificationProps){
    console.log(to)

    fetch("https://exp.host/--/api/v2/push/send",{
        method: "post",
        headers:{
            "content-type":"application/json"
        },
        mode: 'no-cors',
        body:JSON.stringify({
            to:to,
            title: title,
            body: body
        })
    })
}

export function useSendNotification(){
    const {
        isLoading,
        isError,
        isSuccess,
        mutate
    } = useMutation(["sendNotification"],(props:SendPushNotificationProps)=>sendPushNotificationHandler(props))

    return{
        isLoading,
        isError,
        isSuccess,
        mutate
    }
}