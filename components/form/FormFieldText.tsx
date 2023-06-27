import {KeyboardTypeOptions, StyleSheet, Text, TextInput, TextInputProps, View} from "react-native";

interface FormFieldTextProps{
    labelText:string
    keyboardType: KeyboardTypeOptions
    secureTextEntry?:boolean
    value:string
    setValue:(value:string)=>void
}

export function FormFieldText({labelText, keyboardType, secureTextEntry = false, value, setValue}:FormFieldTextProps){
    return(
        <>
            <View style={styles.formItem}>
                <Text style={styles.formLabel}>{labelText}</Text>
                <TextInput
                    style={styles.formInput}
                    placeholder={labelText}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    value={value}
                    onChangeText={(text)=>{setValue(text)}}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    formItem:{
        padding: 5,
        width: "100%",
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