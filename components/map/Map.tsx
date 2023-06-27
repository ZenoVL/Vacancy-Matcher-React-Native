import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from "react-native-maps";
import {mapStyle} from "../../styles/mapStyle";
import React, {useEffect, useState} from "react";
import {onPremisePress} from "../../functions/map/onPremisePress";
import {MapProps} from "../../types/MapProps";
import {globalStyle} from "../../styles/globalStyle";
import {onMapPress} from "../../functions/map/polygonDrawing";
import {Keyboard} from "react-native";
import * as Location from 'expo-location';

// Native version of the map
export function Map({
                        geoJsonData,
                        setSelectedPremise,
                        bottomSheetModalRef,
                        setShowMarker,
                        newPremisesCoords,
                        setDrawerCoords,
                        setNewPremisesCoords,
                        drawerCoords,
                        isDrawing,
                        showMarker,
                        userId,
                        mapRef,
                        location,
                        setLocation,
                        initialRegion,
                        setMarkerLng,
                        setMarkerLat,
                        markerLng,
                        markerLat
                    }: MapProps) {


    useEffect(() => {
        (async () => {
            await Location.requestForegroundPermissionsAsync();
        })();
    }, []);

    return (
        <>
            <MapView showsUserLocation={true} showsMyLocationButton={true} onPress={(event) => {
                Keyboard.dismiss();
                setLocation(null);
                if (event && event.nativeEvent && event.nativeEvent.coordinate && event.nativeEvent.coordinate.longitude && event.nativeEvent.coordinate.latitude) {
                    onMapPress({
                        setPolygonCoords: setNewPremisesCoords,
                        setMarkerCoords: setDrawerCoords,
                        event: event,
                        polygonCoords: newPremisesCoords,
                        isDrawing: isDrawing,
                    })
                }
            }} ref={mapRef} provider={PROVIDER_GOOGLE} style={{flex: 1, zIndex: -2}}
                     customMapStyle={mapStyle}
                     initialRegion={initialRegion}>
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude
                        }}
                        pinColor={globalStyle.premises.color}
                    />
                )}
                {drawerCoords && (
                    <Marker
                        image={require('../../assets/marker.png')}
                        coordinate={drawerCoords}
                    />
                )}
                {newPremisesCoords.length > 0 && (
                    <Polygon
                        coordinates={newPremisesCoords}
                        fillColor={globalStyle.premises.drawColor}
                        strokeColor={globalStyle.premises.strokeColor}
                        strokeWidth={globalStyle.premises.strokeWidth}
                    />
                )}

                {geoJsonData && geoJsonData.map((feature, index) => (
                    <Polygon
                        key={`${index}-${feature.properties!.OBJECTID}`}
                        coordinates={feature.geometry.coordinates[0].map((coord: any) => ({
                            latitude: coord[1],
                            longitude: coord[0]
                        }))}
                        fillColor={feature.properties!.ownerId === undefined || feature.properties!.ownerId === null
                            ? globalStyle.premises.color
                            : feature.properties!.ownerId === userId
                                ? globalStyle.premises.drawColor
                                : globalStyle.premises.claimedColor}
                        strokeColor={globalStyle.premises.strokeColor}
                        strokeWidth={globalStyle.premises.strokeWidth}
                        tappable={true}
                        onPress={() => {
                            if (!isDrawing) {
                                onPremisePress({
                                    setSelectedPremise: setSelectedPremise,
                                    selectedPremise: feature,
                                    bottomSheetModalRef: bottomSheetModalRef,
                                    mapRef: mapRef,
                                    setMarkerLng: setMarkerLng,
                                    setMarkerLat: setMarkerLat,
                                    setShowMarker: setShowMarker
                                });
                            }
                        }}
                    />
                ))}

                {showMarker && (
                    <Marker
                        coordinate={{
                            latitude: markerLat,
                            longitude: markerLng
                        }}
                        pinColor={globalStyle.marker.color}
                    />
                )}
            </MapView>
        </>
    );
}
