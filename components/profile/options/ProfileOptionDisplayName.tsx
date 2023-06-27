import {Pressable} from "react-native";
import {ProfileOption} from "./ProfileOption";
import {useState} from "react";
import {useUpdateUserDisplayName} from "../../../hooks/useUsers";
import {ProfileChangeDisplayName} from "../dialogs/ProfileChangeDisplayName";
import Alert from "react-native-awesome-alerts"
import {Loading} from "../../Loading";
import {AlertAllPlatforms} from "../../AlertAllPlatforms";
import {RootStackParamList} from "../../../App";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";

interface ProfileOptionDisplayNameProps {
    icon: string
    labelText: string
}

export function ProfileOptionDisplayName({icon, labelText}:ProfileOptionDisplayNameProps){
    const [visible, setVisible] = useState<boolean>(false)

    function onOpen(){
        setVisible(true)
    }

    function onClose(){
        setVisible(false)
    }

    return (
        <>
            <Pressable onPress={onOpen}>
                <ProfileOption icon={icon} labelText={labelText}/>
            </Pressable>
            <ProfileChangeDisplayName visible={visible} onClose={onClose}/>
        </>
    )
}