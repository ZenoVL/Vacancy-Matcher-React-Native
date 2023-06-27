import {Feature, Polygon} from "geojson";
import React from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";

export interface MapProps {
    geoJsonData: Feature<Polygon>[];
    setSelectedPremise: (premise: Feature<Polygon> | null) => void;
    selectedPremise: Feature<Polygon> | null;
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    setShowMarker: (show: boolean) => void;
    showMarker: boolean;
    setNewPremisesCoords: (coords: any) => void;
    setDrawerCoords: (coords: any) => void;
    newPremisesCoords: any;
    drawerCoords: any;
    isDrawing: boolean;
    userId: string | undefined;
    setIsPolygonDrawn: (isPolygonDrawn: boolean) => void;
    isPolygonDrawn: boolean;
    drawingManagerRef: any;
    mapRef: any;
    setDrawnPolygon: (drawnPolygon: any) => void;
    drawnPolygon: any;
    location: any;
    setLocation: (location: any) => void;
    initialRegion: any;
    setMarkerLng: (val:number)=>void
    setMarkerLat: (val:number)=>void
    markerLng: number
    markerLat: number
}
