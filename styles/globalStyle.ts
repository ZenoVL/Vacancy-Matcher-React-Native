import {StyleSheet} from 'react-native';
import '../assets/user_location.png'

export const globalStyle = StyleSheet.create({
    premises: {
        color: 'rgb(255, 77, 0)',
        strokeColor: "lightgray",
        strokeWidth: 2,
        claimedColor: "#009933",
        drawColor: '#3A2EFE'
    },
    marker: {
        color: 'purple',
        url: 'https://maps.google.com/mapfiles/marker_purple.png',
        userLocation: require('../assets/user_location.png')
    },
    premisesInfo: {
        color: '#DAFFCB'
    },
    textInput:{
        width: 800,
        maxWidth: "100%",
        marginBottom: 10
    },
    ButtonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    Button: {
        marginRight: 10,
        backgroundColor: 'rgb(255, 77, 0)',
        marginBottom: 20,
        marginTop: 20,
        maxWidth: 400
    },
    loading:{
        flex: 1,
        justifyContent:"center"
    }
});
