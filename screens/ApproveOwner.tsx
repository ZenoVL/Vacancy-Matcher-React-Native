import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {BackButton} from "../components/BackButton";
import {ApproveOwnerForm} from "../components/approveOwner/ApproveOwnerForm";
import {StyleSheet, Text, View} from "react-native";
import FooterNavigation from "../components/NavigationFooter";
import React from "react";

type Props = NativeStackScreenProps<RootStackParamList, 'ApproveOwner'>;

export function ApproveOwner({route}: Props) {
    const premisesId = route.params?.premisesId

    console.log(premisesId)

    return (
        <>
            <ApproveOwnerForm premisesId={premisesId}/>
            <FooterNavigation/>
        </>
    )
}
