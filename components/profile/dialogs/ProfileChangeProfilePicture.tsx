import {Alert, Button, Image, StyleSheet, View} from "react-native";
import Dialog from "react-native-dialog";
import {
    ImagePickerAsset,
    launchImageLibraryAsync,
    MediaTypeOptions,
    PermissionStatus,
    useMediaLibraryPermissions
} from 'expo-image-picker';
import {useUpdateProfilePicture} from "../../../hooks/useUsers";
import {Loading} from "../../Loading";
import {useHorizontalScale} from "../../../hooks/useDimensions";
import {useState} from "react";

interface ProfileChangeProfilePictureProps{
    visible:boolean
    onClose:()=>void
    onChange:(uri:string)=>void
}

export function ProfileChangeProfilePicture({visible, onClose, onChange}:ProfileChangeProfilePictureProps){
    const [mediaLibraryPermissionInformation, requestPermission] = useMediaLibraryPermissions()
    const [fileUrl, setFileUrl] = useState<string>("https://firebasestorage.googleapis.com/v0/b/vacancy-matcher-3musketeers.appspot.com/o/default%2Fimages%2Fdefault%20profile.png?alt=media&token=2c28c339-2674-49ca-8127-7d1391019699")

    async function verifyPermissions(){
        if(mediaLibraryPermissionInformation?.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission()

            return permissionResponse.granted
        }

        if(mediaLibraryPermissionInformation?.status === PermissionStatus.DENIED){
            Alert.alert("onvoldoende toegang", "De app heeft toegang nodig tot foto's om verder te kunnen gaan")

            const permissionResponse = await requestPermission()

            return permissionResponse.granted
        }

        return true
    }

    async function pickImage(){
        const hasPermission = await verifyPermissions()

        if(!hasPermission){
            return
        }

        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 5],
            quality: 0.5,
        });

        if (!result.canceled) {
            setFileUrl(result.assets[0].uri)
        }
    }

    // if(isLoading){
    //     return <Loading/>
    // }
    //
    // if(isError){
    //     AlertAllPlatforms.alert("Afbeelding uploaden mislukt", "het uploaden van de afbeelding is mislukt")
    // }

    return(
        <View>
            <Dialog.Container visible={visible}>
                <Dialog.Title>Profiel foto veranderen</Dialog.Title>
                <Dialog.Description>
                    <View>
                        <Button title={"Kies foto"} onPress={pickImage}/>
                    </View>
                    <View>
                        <Image style={styles.image} source={{uri: fileUrl}}/>
                    </View>
                </Dialog.Description>
                <Dialog.Button label="Annuleer" onPress={onClose}/>
                <Dialog.Button label="Veranderen" onPress={()=>onChange(fileUrl)}/>
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        width: useHorizontalScale(15),
        height: useHorizontalScale(15),
        borderRadius: useHorizontalScale(15)/2,
        marginRight: 10
    }
})