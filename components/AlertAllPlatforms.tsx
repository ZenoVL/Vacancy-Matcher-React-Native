import {useState} from "react";
import {Text, View} from "react-native"
import {Button, Dialog, Portal} from "react-native-paper";

interface AlertProps{
    title: string,
    message: string,
    show:boolean,
    onClose:()=>void
}

export function AlertAllPlatforms({title, message, show, onClose}:AlertProps){
    console.log(show)

    return (
        <>
            <Portal>
                <Dialog visible={show} onDismiss={onClose}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        <Text>{message}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    )
}