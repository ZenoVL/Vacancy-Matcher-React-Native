import {Drawer, IconButton, styled} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import {InfoPanelProps} from "../../types/InfoPanelProps";
import {globalStyle} from "../../styles/globalStyle";
import {PremisesInfo} from "./PremisesInfo";

const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    background-color: ${globalStyle.premisesInfo.color};
    min-width: 320pt;
    max-width: 320pt;
  }
`;

// Web version of the premises info
export function InfoPanel({
                              selectedPremise,
                              setSelectedPremise
                          }: InfoPanelProps) {
    return (
        <>
            {selectedPremise && (
                <StyledDrawer
                    variant="persistent"
                    anchor="left"
                    open={!!selectedPremise}
                    onClose={() => setSelectedPremise(null)}
                >
                    <IconButton
                        onClick={() => setSelectedPremise(null)}
                        sx={{position: 'absolute', top: '1rem', right: '1rem', zIndex: 3}}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <PremisesInfo modalRef={undefined} setSelectedPremises={setSelectedPremise}
                                  selectedPremises={selectedPremise}/> </StyledDrawer>
            )}
        </>
    );
}
