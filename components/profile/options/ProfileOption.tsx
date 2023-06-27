import {Image, StyleSheet, Text, View} from "react-native";

interface ProfileOptionProps{
    icon: string,
    labelText: string
}

export function ProfileOption({icon, labelText}:ProfileOptionProps){
    return(
        <>
            <View style={styles.container}>
                <Image style={styles.icon} source={{uri: icon}}/>
                <Text style={styles.text}>{labelText}</Text>
            </View>
            <View style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "grey"
            }}/>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginLeft: 30
    },
    icon:{
        width: 40,
        height: 40,
        marginRight: 20
    },
    text:{
        fontSize: 15
    }
})