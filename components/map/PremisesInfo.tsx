import {Button, List} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {Feature, Polygon} from "geojson";
import {StyleSheet, View} from "react-native";
import {useGetLoggedInUser} from "../../hooks/useUsers";
import {RootStackParamList} from "../../App";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";
import {globalStyle} from "../../styles/globalStyle";
import {PhotoSection} from "./PhotoSection";
import {Loading} from "../Loading";
import {getUserProperties} from "../../services/PropertiesService";
import {getUserChatsWithLastMessage} from "../../services/ChatService";
import {Premise} from "../../models/Premise";
import {PremiseDto} from "../../models/dto/PremiseDto";


interface PremisesInfoProps {
    selectedPremises: Feature<Polygon> | null;
    setSelectedPremises: (selectedPremises: Feature<Polygon> | null) => void;
    modalRef: any;
}

const styles = StyleSheet.create({
    listItem: {
        paddingLeft: 16,
        flex: 1,
    },
    itemButton: {
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 30,
        height: 50,
        padding: 10,
        paddingLeft: "27%",
        margin: 10,
        backgroundColor: "lightgrey"
    },

    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    changePriceButton: {
        backgroundColor: globalStyle.premises.color,
        marginHorizontal: 10,
        marginBottom: 10,
        maxWidth: 400,
    },
});

export function PremisesInfo({selectedPremises, setSelectedPremises, modalRef}: PremisesInfoProps) {
    const {isLoading, isError, isLoggedIn, data} = useGetLoggedInUser()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    if (isLoading) {
        return <View style={{flex: 1, alignItems: "center"}}><Loading/></View>
    }

    if (isError) {
        alert("het laden is mislukt, probeer later opnieuw")
    }

    return <>
        <List.Section>
            <PhotoSection isLoggedIn={isLoggedIn} loggedInUser={data} selectedPremises={selectedPremises}/>
            <List.Subheader>Adresgegevens</List.Subheader>
            <List.Item
                title="Straat"
                description={selectedPremises?.properties?.pva_straat || ''}
                left={() => <List.Icon icon="map-marker" color="black"/>}
                style={styles.listItem}
            />
            <List.Item
                title="Huisnummer"
                description={selectedPremises?.properties?.pva_huisnr1 || ''}
                left={() => <List.Icon icon="numeric-1-box" color="black"/>}
                style={styles.listItem}
            />
            {selectedPremises?.properties?.pva_huisnr2 && (
                <List.Item
                    title="Huisnummer 2"
                    description={selectedPremises?.properties?.pva_huisnr2}
                    left={() => <List.Icon icon="numeric-2-box" color="black"/>}
                    style={styles.listItem}
                />
            )}
            <List.Item
                title="Postcode"
                description={selectedPremises?.properties?.pva_postcode || ''}
                left={() => <List.Icon icon="numeric" color="black"/>}
                style={styles.listItem}
            />
            <List.Item
                title="District"
                description={selectedPremises?.properties?.pnd_district || ''}
                left={() => <List.Icon icon="map-marker-radius" color="black"/>}
                style={styles.listItem}
            />
        </List.Section>

        <List.Section>
            <List.Subheader>Pand informatie</List.Subheader>
            {selectedPremises?.properties?.description && (
                <List.Item
                    title=""
                    description={selectedPremises?.properties?.description || ''}
                />
            )}
            {selectedPremises?.properties?.SHAPE_Area && (
                <List.Item
                    title="Oppervlakte"
                    description={`${selectedPremises?.properties?.SHAPE_Area.toFixed(2)} ㎡` || ''}
                    left={() => <List.Icon icon="set-square" color="black"/>}
                    style={styles.listItem}
                />
            )}
            {selectedPremises?.properties?.SHAPE_Length && (
                <List.Item
                    title="Lengte"
                    description={`${selectedPremises?.properties?.SHAPE_Length.toFixed(2)} m` || ''}
                    left={() => <List.Icon icon="ruler" color="black"/>}
                    style={styles.listItem}
                />
            )}
            {selectedPremises?.properties?.reg_aard && (
                <List.Item
                    title="Type"
                    description={`${selectedPremises?.properties?.reg_aard}` || ''}
                    left={() => <List.Icon icon="home" color="black"/>}
                    style={styles.listItem}
                />)}
            {selectedPremises?.properties?.price && (
                <List.Item
                    title="Prijs/maand"
                    description={
                        `€ ${selectedPremises?.properties?.price.toFixed(2)}` || ''}
                    left={() => <List.Icon icon="currency-eur" color="black"/>}
                    style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.aantalVerdiepingen && (
                <List.Item
                    title="Aantal verdiepingen"
                    description={`${selectedPremises?.properties?.aantalVerdiepingen}`}
                    left={() => <List.Icon icon="floor-plan" color="black"/>}
                    style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.staat && (
                <List.Item
                    title="Conditie"
                    description={`${selectedPremises?.properties?.staat}`}
                    left={() => <List.Icon icon="home-alert" color="black"/>}
                    style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.centraleVerwarmingAanwezig !== undefined && (
                <List.Item title="Verwarming aanwezig"
                           left={() => <List.Icon icon="fire" color="black"/>}
                           right={() => selectedPremises?.properties?.centraleVerwarmingAanwezig ?
                               <List.Icon icon="check" color="green"/> : <List.Icon icon="close" color="red"/>}
                           style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.krachtstroomMogelijk !== undefined && (
                <List.Item title="Krachtstroom mogelijk"
                           left={() => <List.Icon icon="power-socket" color="black"/>}
                           right={() => selectedPremises?.properties?.krachtstroomMogelijk ?
                               <List.Icon icon="check" color="green"/> :
                               <List.Icon icon="close" color="red"/>}
                           style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.electriciteitAanwezig !== undefined && (
                <List.Item title="Electriciteit aanwezig"
                           left={() => <List.Icon icon="power-plug" color="black"/>}
                           right={() => selectedPremises?.properties?.electriciteitAanwezig ?
                               <List.Icon icon="check" color="green"/> :
                               <List.Icon icon="close" color="red"/>}
                           style={styles.listItem}/>
            )}
            {selectedPremises?.properties?.waterAansluitingAanwezig !== undefined && (
                <List.Item title="Water aansluiting aanwezig"
                           left={() => <List.Icon icon="water" color="black"/>}
                           right={() => selectedPremises?.properties?.waterAansluitingAanwezig ?
                               <List.Icon icon="check" color="green"/> :
                               <List.Icon icon="close" color="red"/>}
                           style={styles.listItem}/>
            )}
        </List.Section>

        <View style={{alignItems: "center"}}>
            {isLoggedIn && data?.isOwner && selectedPremises?.properties?.ownerId === data?.uid && (
                <Button
                    icon="pencil"
                    mode="contained"
                    onPress={() => {
                        navigation.navigate("CreatedPremises", {
                            coordinates: selectedPremises?.geometry?.coordinates,
                            ownerId: data?.uid,
                            selectedPremises: selectedPremises
                        })
                        setSelectedPremises(null)
                        modalRef?.current.close()
                    }
                    }
                    style={globalStyle.Button}>
                    Wijzig pand info
                </Button>
            )}
            <Button
                mode="contained"
                icon={"arrow-expand-all"}
                onPress={() => navigation.navigate('PropertyList', {propId: selectedPremises?.properties?.OBJECTID.toString()})}
                style={globalStyle.Button}>
                Open in lijst
            </Button>
            {isLoggedIn && data?.isOwner && selectedPremises?.properties?.ownerId === undefined &&
                <Button
                    mode={"contained"}
                    icon={"check"}
                    onPress={() => navigation.navigate("ApproveOwner", {premisesId: selectedPremises?.properties?.OBJECTID})}
                    style={styles.changePriceButton}
                >
                    Eigenaar verifiëren
                </Button>}
        </View>
    </>;
}
