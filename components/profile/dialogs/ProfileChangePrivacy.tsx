import Dialog from "react-native-dialog";
import {StyleSheet, View} from "react-native";
import {FormFieldCheckBox} from "../../form/FormFieldCheckBox";
import {useState} from "react";

interface ProfileChangePrivacyProps {
    visible: boolean
    isAnonymous:boolean
    setIsAnonymous:(value:boolean)=>void
    onClose: () => void
    onChange: (value:boolean) => void
}

export function ProfileChangePrivacy({visible, isAnonymous, setIsAnonymous, onClose, onChange}:ProfileChangePrivacyProps){
    return(
        <View>
            <Dialog.Container visible={visible}>
                <Dialog.Title>Privacy veranderen</Dialog.Title>
                <Dialog.Description>
                    <FormFieldCheckBox labelText={"Anoniem"} value={isAnonymous} setValue={setIsAnonymous}/>
                </Dialog.Description>
                <Dialog.Button label="Annuleer" onPress={onClose}/>
                <Dialog.Button label="Veranderen" onPress={()=>onChange(isAnonymous)}/>
            </Dialog.Container>
        </View>
    )
}