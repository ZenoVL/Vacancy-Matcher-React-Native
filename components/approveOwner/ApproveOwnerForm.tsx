import {getDocumentAsync} from "expo-document-picker";
import {Alert, StyleSheet, Text, View} from "react-native";
import {useState} from "react";
import {useAddApprove} from "../../hooks/useApproveOwner";
import {Loading} from "../Loading";
import {TextInput, Button} from "react-native-paper";
import {globalStyle} from "../../styles/globalStyle";

interface ApproveOwnerFormProps{
    premisesId:number
}

export function ApproveOwnerForm({premisesId}:ApproveOwnerFormProps){
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [fileUrl, setFileUrl] = useState<string>("")
    const {isLoading, isError, mutate} = useAddApprove()

    async function handleDocumentPicker(){
        const result = await getDocumentAsync({type: "application/pdf"})

        if(result.type === "cancel"){
            return
        }

        setFileUrl(result.uri)
    }

    function handleSubmit(){
        mutate({premisesId: premisesId, fileUrl: fileUrl, phoneNumber: phoneNumber})
    }

    if(isLoading){
        return <View style={{flex: 1, justifyContent:"center"}}><Loading/></View>
    }

    if(isError){
        alert("Uw verzoek is niet verzonden, probeer later opnieuw")
    }

    return(
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Bevestig eigenaar</Text>
                <TextInput style={globalStyle.textInput} label={"Telefoonnummer"} keyboardType={"phone-pad"} value={phoneNumber} onChangeText={setPhoneNumber}/>
                <Text style={styles.link} onPress={()=>handleDocumentPicker()}>Upload kadastraal uitreksel</Text>
                <Button icon={"logout"} mode={"contained"} style={[globalStyle.Button, {maxWidth: 400}]} onPress={handleSubmit}>Vraag aan</Button>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title:{
        textAlign: "center",
        fontSize: 40,
        marginBottom: 20
    },
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent:"center",
        padding: 30,
    },
    link:{
        color: "orange",
        borderColor: "orange",
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        width: "100%",
        maxWidth: 400,
        textAlign: "center"
    }
})