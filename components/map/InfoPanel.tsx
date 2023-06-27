import {BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import React, {useMemo} from "react";
import {Feature, Polygon} from "geojson";
import {InfoPanelProps} from "../../types/InfoPanelProps";
import {globalStyle} from "../../styles/globalStyle";
import {PremisesInfo} from "./PremisesInfo";

interface onBottomSheetModalDismissProps {
    setSelectedPremise: (premise: Feature<Polygon> | null) => void;
    setShowMarker: (showMarker: boolean) => void;
}

export function onBottomSheetModelDismiss({setSelectedPremise, setShowMarker}: onBottomSheetModalDismissProps) {
    setSelectedPremise(null);
    setShowMarker(false);
}

// Native version of the premises info
export function InfoPanel({
                              selectedPremise,
                              setSelectedPremise,
                              bottomSheetModalRef,
                              setShowMarker
                          }: InfoPanelProps) {
    const snapPoints = useMemo(() => ['50%', '85%'], []);

    return <>
        <BottomSheetModal backgroundStyle={{
            backgroundColor: globalStyle.premisesInfo.color
        }} ref={bottomSheetModalRef} index={0} snapPoints={snapPoints}
                          onDismiss={() => onBottomSheetModelDismiss({
                              setSelectedPremise: setSelectedPremise,
                              setShowMarker: setShowMarker
                          })}>
            <BottomSheetScrollView>
                <PremisesInfo selectedPremises={selectedPremise} setSelectedPremises={setSelectedPremise}
                              modalRef={bottomSheetModalRef}/>
            </BottomSheetScrollView>
        </BottomSheetModal>
    </>
}
