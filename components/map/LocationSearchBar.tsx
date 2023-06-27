import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {StyleSheet, View} from "react-native";
import React from "react";

interface LocationSearchBarProps {
    setLocation: (location: any) => void
    mapRef: any
}

interface handlePlaceSelectProps {
    details: any,
    setLocation: (location: any) => void,
    mapRef: any
}

function handlePlaceSelect({details, setLocation, mapRef}: handlePlaceSelectProps) {
    const {lat, lng} = details.geometry.location;

    mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.003, // adjust this value to control zoom level
        longitudeDelta: 0.003,
    });

    setLocation({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
    });
}

export function LocationSearchBar({setLocation, mapRef}: LocationSearchBarProps) {

    return <>
        <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
                fetchDetails={true}
                placeholder='Zoek op adres'
                onPress={(data, details) => {
                    handlePlaceSelect({details, setLocation, mapRef})
                }}
                query={{
                    key: "AIzaSyDdgtmzTfbQXLXyi3Mes3jSGdcdxY63jPE", // Your Google Maps API key
                    language: 'nl', // Language code for Dutch
                    components: 'country:be', // Restrict results to Belgium
                }}
                styles={searchBarStyle}
            />
        </View>
    </>
}

const searchBarStyle = StyleSheet.create({
    container: {
        flex: 1,
        height: 40,
    },
    textInputContainer: {
        flex: 1,
        height: 40,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    textInput: {
        flex: 1,
        height: 40,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 16,
        backgroundColor: 'transparent',
        color: 'black',
        borderRadius: 20,
        borderColor: 'lightgrey',
    },
    listView: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        flex: 1,
        elevation: 3,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
})

const styles = StyleSheet.create({
    searchContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    }
});
