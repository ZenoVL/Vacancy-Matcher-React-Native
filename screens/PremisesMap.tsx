import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from "react";
import {Map} from "../components/map/Map";
import {Feature, Polygon} from "geojson";
import {getPremisesData, getPropertyData} from "../services/PremisesService";
import {BottomSheetModal, BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {InfoPanel} from "../components/map/InfoPanel";
import {Loading} from "../components/Loading";
import {Banner, Button} from "react-native-paper";
import {clearPolygon} from "../functions/map/polygonDrawing";
import MapView, {LatLng} from "react-native-maps";
import {useGetLoggedInUser} from "../hooks/useUsers";
import FooterNavigation from "../components/NavigationFooter";
import {globalStyle} from "../styles/globalStyle";
import {LocationSearchBar} from "../components/map/LocationSearchBar";
import {onPremisePress} from "../functions/map/onPremisePress";
import {Legend} from "../components/map/Legend";

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export function PremisesMap({route, navigation}: Props) {
    const [geoJsonData, setGeoJsonData] = useState<Feature<Polygon>[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [selectedPremise, setSelectedPremise] = useState<Feature<Polygon> | null>(null);
    const [showMarker, setShowMarker] = useState<boolean>(false);
    const [newPremisesCoords, setNewPremisesCoords] = useState<LatLng[]>([]);
    const [drawerCoords, setDrawerCoords] = useState<LatLng | undefined>();
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const {isLoading, isError, isLoggedIn, data} = useGetLoggedInUser()
    const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);
    const drawingManagerRef = useRef<any>();
    const mapRef = useRef<google.maps.Map | MapView>(null);
    const [location, setLocation] = useState<any>(null);
    const [markerLng, setMarkerLng] = useState(0);
    const [markerLat, setMarkerLat] = useState(0);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // web drawn polygon
    const [drawnPolygon, setDrawnPolygon] = useState<any>(null);

    const initialRegion = {
        latitude: 51.22269129557317,
        longitude: 4.404767656610872,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    const premisesId = route.params?.premisesId

    useEffect(() => {
        if (premisesId !== null && premisesId !== undefined) {
            getPropertyData(premisesId)
                .then((p) => {
                    if (Platform.OS !== 'web') {
                        onPremisePress({
                            setSelectedPremise: setSelectedPremise,
                            selectedPremise: p,
                            bottomSheetModalRef: bottomSheetModalRef,
                            mapRef: mapRef,
                            setMarkerLng: setMarkerLng,
                            setMarkerLat: setMarkerLat,
                            setShowMarker: setShowMarker
                        });
                    } else {
                        setSelectedPremise(p);
                    }
                })
        }
    }, [premisesId])

    useEffect(() => {
        getPremisesData({
            setGeoJsonData,
            setLoading
        });
    }, [])

    if (loading || isLoading) {
        return <><View style={globalStyle.loading}>
            <Loading/></View><FooterNavigation/></>
    }

    if (isError) {
        alert("Er is iets misgegaan met het ophalen van de data. Probeer het later opnieuw.")
    }

    return <>
        <BottomSheetModalProvider>
            {Platform.OS !== 'web' && <LocationSearchBar setLocation={setLocation} mapRef={mapRef}/>}
            <Banner
                style={styles.tooltip}
                icon="lightbulb-on-outline"
                visible={tooltipVisible}
                actions={[
                    {
                        buttonColor: globalStyle.premises.color,
                        textColor: "white",
                        label: 'OK',
                        onPress: () => setTooltipVisible(false),
                    }
                ]}>
                <Text style={styles.tooltipText}>Tik op de hoeken van een pand om het op de kaart te tekenen.</Text>
            </Banner>
            <Map geoJsonData={geoJsonData} setSelectedPremise={setSelectedPremise}
                 bottomSheetModalRef={bottomSheetModalRef} selectedPremise={selectedPremise}
                 setShowMarker={setShowMarker} showMarker={showMarker} drawerCoords={drawerCoords}
                 setNewPremisesCoords={setNewPremisesCoords} newPremisesCoords={newPremisesCoords}
                 setDrawerCoords={setDrawerCoords}
                 isDrawing={isDrawing} userId={data?.uid} setIsPolygonDrawn={setIsPolygonDrawn}
                 isPolygonDrawn={isPolygonDrawn} drawingManagerRef={drawingManagerRef} mapRef={mapRef}
                 drawnPolygon={drawnPolygon} setDrawnPolygon={setDrawnPolygon} location={location}
                 setLocation={setLocation} initialRegion={initialRegion} markerLng={markerLng}
                 setMarkerLng={setMarkerLng} setMarkerLat={setMarkerLat} markerLat={markerLat}
            />
            <View style={styles.legendContainer}>
                <Legend isOwner={data?.isOwner}/>
            </View>
            <InfoPanel selectedPremise={selectedPremise} setSelectedPremise={setSelectedPremise}
                       bottomSheetModalRef={bottomSheetModalRef} setShowMarker={setShowMarker}/>
        </BottomSheetModalProvider>

        {!isDrawing && isLoggedIn && data?.isOwner && !selectedPremise && (
            <View style={styles.buttonContainer}>
                <Button textColor="black" style={[styles.drawPremisesButton, styles.bottomButton]} mode="contained"
                        icon="plus"
                        onPress={() => {
                            setTooltipVisible(true)
                            setIsDrawing(true)
                        }}>Pand</Button>
            </View>
        )}

        {isDrawing && newPremisesCoords.length > 2 && (
            <View style={styles.buttonContainer}>
                <Button textColor="black" style={[styles.drawPremisesButton, styles.topButton]} mode="contained"
                        icon="check" onPress={() => {
                    navigation.navigate("CreatedPremises", {
                        coordinates: newPremisesCoords,
                        ownerId: data?.uid,
                        selectedPremises: selectedPremise
                    })
                    setTooltipVisible(false)
                    clearPolygon({
                        setPolygonCoords: setNewPremisesCoords,
                        setMarkerCoords: setDrawerCoords,
                        setIsPolygonDrawn,
                        setIsDrawing,
                        drawingManagerRef,
                        drawnPolygon
                    })
                }
                }>
                    Opslaan
                </Button>
            </View>
        )}
        {isDrawing && (
            <View style={styles.buttonContainer}>
                <Button textColor="black" style={[styles.drawPremisesButton, styles.bottomButton]} mode="contained"
                        icon="cancel"
                        onPress={() => {
                            setTooltipVisible(false)
                            clearPolygon({
                                setIsDrawing,
                                setPolygonCoords: setNewPremisesCoords,
                                setMarkerCoords: setDrawerCoords,
                                setIsPolygonDrawn,
                                drawnPolygon
                            })
                        }}>Annuleer</Button>
            </View>
        )}
        <FooterNavigation/>
    </>
}

const styles = StyleSheet.create({
    drawPremisesButton: {
        position: "absolute",
        alignSelf: "center", // set to center
        margin: 10,
        marginLeft: 30,
        bottom: 30, // adjust bottom to center vertically
        backgroundColor: "#FFFFFF",
        borderWidth: 1, // add border width
        borderColor: "#000000",
    },
    topButton: {
        bottom: 60, // move the Reset button up
    },
    bottomButton: {
        bottom: 5,
    },
    buttonContainer: {
        zIndex: -1
    },
    tooltip: {
        backgroundColor: "white"
    },
    tooltipText: {
        color: "black",
        fontSize: 16,
    },
    legendContainer: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        borderRadius: 8,
        margin: 2,
    },
})
