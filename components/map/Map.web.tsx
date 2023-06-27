import React, {useMemo, useState} from "react";
import {
    Autocomplete,
    DrawingManager,
    GoogleMap,
    Marker,
    Polygon,
    useLoadScript
} from "@react-google-maps/api";
import {View} from "react-native";
import {mapStyle} from "../../styles/mapStyle";
import {globalStyle} from "../../styles/globalStyle";
import {MapProps} from "../../types/MapProps";
import {calculatePolygonCenter} from "../../functions/map/calculatePolygonCenter";
import {Loading} from "../Loading";
import {useUserLocation} from "../../hooks/useUserLocation";

const containerStyle = {
    height: "100vh",
    width: "100%",
    zIndex: -2
};

const libraries: any = ["drawing", "places"];

export function Map({
                        geoJsonData,
                        setSelectedPremise,
                        selectedPremise,
                        userId,
                        isDrawing,
                        setNewPremisesCoords,
                        isPolygonDrawn,
                        setIsPolygonDrawn,
                        drawingManagerRef,
                        mapRef,
                        setDrawnPolygon,
                    }: MapProps) {
    // hardcoded api key for now (should be in storage of firebase)
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyDdgtmzTfbQXLXyi3Mes3jSGdcdxY63jPE", libraries: libraries
    })

    const [location, setLocation] = useState<any>({lat: 51.22269129557317, lng: 4.404767656610872});
    const center = useMemo(() => ({lat: location.lat, lng: location.lng}), [location.lat || location.lng]);
    const userLocation = useUserLocation();

    const [autocomplete, setAutocomplete] = useState<any>(null);
    const [showLocationMarker, setShowLocationMarker] = useState(false);

    if (!isLoaded) return <View style={{flex: 1, alignItems: "center"}}><Loading/></View>
    if (loadError) return <div>Map cannot be loaded right now, sorry.</div>

    // kan niet in aparte functie => anders cors error
    const onLoadDrawingManager = (drawingManager: any) => {
        drawingManagerRef.current = drawingManager;
    }

    const onPlaceSelect = (place: any) => {
        setLocation({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
        setShowLocationMarker(true);
    };

    // kan niet in aparte functie => anders cors error
    const onPolygonComplete = (polygon: any) => {
        setNewPremisesCoords(polygon.getPath().getArray().map((coord: any) => ({lat: coord.lat(), lng: coord.lng()})));
        setIsPolygonDrawn(true);
        drawingManagerRef.current.setDrawingMode(null);
        setDrawnPolygon(polygon);
    }

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: globalStyle.premises.drawColor,
        strokeColor: globalStyle.premises.drawColor,
        strokeWeight: 2,
        draggable: false,
        editable: false
    }

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: false,
        drawingMode: window.google?.maps?.drawing?.OverlayType?.POLYGON,
    }

    return <>
        <GoogleMap
            onClick={() => setShowLocationMarker(false)}
            options={{
                styles: mapStyle,
                fullscreenControl: false,
                backgroundColor: "transparent",
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                }
            }}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={(map) => {
                mapRef.current = map;
            }}
        >
            {userLocation && (
                <>
                    <Marker
                        position={{lat: userLocation.coords.latitude, lng: userLocation.coords.longitude}}
                        icon={globalStyle.marker.userLocation}
                    />
                </>
            )}
            <Autocomplete
                options={{
                    componentRestrictions: {country: "be"}
                }}
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={() => {
                    const place = autocomplete.getPlace();
                    onPlaceSelect(place);
                }}
            >
                <input
                    type="text"
                    placeholder="Zoek op adres"
                    style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `240px`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        top: "10px",
                        textOverflow: `ellipses`,
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-120px"
                    }}
                />
            </Autocomplete>
            {isDrawing && !isPolygonDrawn && (
                <DrawingManager
                    onLoad={onLoadDrawingManager}
                    onPolygonComplete={onPolygonComplete}
                    options={drawingManagerOptions}
                />)}

            {geoJsonData && geoJsonData.map((feature, index) => (
                <Polygon
                    key={`${index}-${feature.properties!.OBJECTID}`}
                    path={feature.geometry.coordinates[0].map((coord: any) => ({lat: coord[1], lng: coord[0]}))}
                    options={{
                        fillColor: feature.properties!.ownerId === undefined || feature.properties!.ownerId === null
                            ? globalStyle.premises.color
                            : feature.properties!.ownerId === userId
                                ? globalStyle.premises.drawColor
                                : globalStyle.premises.claimedColor,
                        strokeColor: globalStyle.premises.strokeColor,
                        strokeWeight: globalStyle.premises.strokeWidth,
                        clickable: true,
                    }}
                    onClick={() => {
                        if (!isDrawing) {
                            setSelectedPremise(feature);
                        }
                    }}
                />
            ))}
            {selectedPremise && (
                <Marker
                    icon={globalStyle.marker.url}
                    position={{
                        lat: calculatePolygonCenter(selectedPremise.geometry).centerLat,
                        lng: calculatePolygonCenter(selectedPremise.geometry).centerLng
                    }}
                />
            )}
            {location && showLocationMarker && (
                <Marker
                    position={{
                        lat: location.lat,
                        lng: location.lng
                    }}
                />
            )}
        </GoogleMap>
    </>
}
