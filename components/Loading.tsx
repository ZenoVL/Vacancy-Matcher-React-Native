import React from "react";
import {ActivityIndicator, MD2Colors} from "react-native-paper";

export function Loading(){
    return <ActivityIndicator animating={true} color={MD2Colors.amber500} size={"large"}/>
}