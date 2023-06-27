import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";

interface FormFieldButtonProps{
    onPress: ()=>void
    title: string
}

export function FormFieldButton({onPress, title}:FormFieldButtonProps){
    return(
        <>
            <Pressable onPress={onPress} style={styles.button}><Text>{title}</Text></Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    button:{
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 30,
        height: 50,
        padding: 10,
        paddingTop: 12,
        margin: 10,
        flexDirection: "row"
    }
})