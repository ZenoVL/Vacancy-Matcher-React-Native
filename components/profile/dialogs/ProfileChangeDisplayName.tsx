import {useState} from "react";
import {Alert, View} from "react-native";
import {FormFieldText} from "../../form/FormFieldText";
import {Button, Dialog, Portal, TextInput} from "react-native-paper";
import {useUpdateUserDisplayName} from "../../../hooks/useUsers";
import {Loading} from "../../Loading";

interface ProfileChangeDisplayNameProps {
    visible: boolean
    onClose: () => void
}

export function ProfileChangeDisplayName({visible, onClose}: ProfileChangeDisplayNameProps) {
    const [displayName, setDisplayName] = useState<string>("")
    const {isLoading, isError, isSuccess, mutate} = useUpdateUserDisplayName()

    if(isLoading){
        return <Loading/>
    }

    if(isError){
        Alert.alert("Veranderen mislukt", "Het veranderen van de gebruikersnaam is mislukt")
    }

    function onChange(){
        mutate(displayName)
        onClose()
    }

    return (
        <View>
            <Portal>
                <Dialog visible={visible} onDismiss={onClose}>
                    <Dialog.Title>gebruikersnaam veranderen</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label={"Gebruikersnaam"} keyboardType={"default"} mode={"flat"} value={displayName} onChangeText={(val)=>setDisplayName(val)}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>Annuleer</Button>
                        <Button onPress={onChange}>Veranderen</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}