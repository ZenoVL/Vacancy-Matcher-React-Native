import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

interface FormFieldCheckBoxProps{
    labelChecked:string
    labelUnchecked:string
    value:boolean
    onChange:()=>void
}

export function FormFieldCheckBox({labelChecked, labelUnchecked, value, onChange}:FormFieldCheckBoxProps){
    return(
        <>
            <View style={{flexDirection:"row"}}>
                <Checkbox status={value?"checked":"unchecked"} onPress={onChange}/>
                <Text onPress={onChange} style={{padding: 7}}>{value?labelChecked:labelUnchecked}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    formItem:{
        padding: 5,
        width: "100%",
        flexDirection: "row"
    },
    formInput:{
        backgroundColor: "grey",
        borderRadius: 10,
        padding: 5
    },
    formLabel:{
        paddingLeft: 5
    },
})