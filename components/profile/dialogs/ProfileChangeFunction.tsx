import {useState} from "react";
import {Alert, View, Text} from "react-native";
import {Button, Portal, Checkbox, Dialog } from "react-native-paper";
import {useUpdateUserFunction} from "../../../hooks/useUsers";
import {Loading} from "../../Loading";

interface ProfileChangeFunctionProps{
    visible: boolean
    onClose: () => void,
    isOwner:boolean
}

export function ProfileChangeFunction({visible, onClose, isOwner:isOwnerCurrent}:ProfileChangeFunctionProps){
    const [isOwner, setIsOwner] = useState<boolean>(isOwnerCurrent)
    const {isLoading, isError, mutate} = useUpdateUserFunction()

    if(isLoading){
        return <Loading/>
    }

    if(isError){
        Alert.alert("Veranderen mislukt", "Het veranderen van de status is mislukt")
    }

    function onChange(){
        mutate(isOwner)
        onClose()
    }

    return(
        <View>
            <Portal>
                <Dialog visible={visible} onDismiss={onClose}>
                    <Dialog.Title>status veranderen</Dialog.Title>
                    <Dialog.Content>
                        <View style={{flexDirection:"row"}}>
                            <Checkbox status={isOwner?"checked":"unchecked"} onPress={()=>setIsOwner(!isOwner)}/>
                            <Text style={{margin:"auto"}}>{isOwner?"eigenaar":"zoeker"}</Text>
                        </View>
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