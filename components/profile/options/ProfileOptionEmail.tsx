import {Alert, Pressable} from "react-native";
import {ProfileOption} from "./ProfileOption";
import {ProfileChangePassword} from "../ProfileChangePassword";
import {useState} from "react";
import {ProfileChangeEmail} from "../ProfileChangeEmail";
import {useMutation} from "react-query";
import {useUpdateUserEmail} from "../../../hooks/useUsers";
import {updateUserEmailProps} from "../../../services/UserService";
import {Loading} from "../../Loading";
import {AlertAllPlatforms} from "../../AlertAllPlatforms";
import {RootStackParamList} from "../../../App";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";

interface ProfileOptionEmailProps {
    icon: string
    labelText: string
}

export function ProfileOptionEmail({icon, labelText}:ProfileOptionEmailProps){
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
            <ProfileChangeEmail visible={visible} onClose={onClose}/>
        </>
    )
}