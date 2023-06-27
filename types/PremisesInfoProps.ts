import {Feature, Polygon} from "geojson";
import React from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";

export interface PremisesInfoProps {
    selectedPremise: Feature<Polygon> | null;
    setSelectedPremise: (premise: Feature<Polygon> | null) => void;
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    setShowMarker: (showMarker: boolean) => void;
}
