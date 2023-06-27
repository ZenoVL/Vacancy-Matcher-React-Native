import {List} from "react-native-paper";
import {ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {pickPremisesImage} from "../../functions/map/pickPremisesImage";
import React, {useEffect, useState} from "react";
import {Feature, Polygon} from "geojson";
import {ImageModal} from "./ImageModal";
import {downloadPremisesImages} from "../../services/storageService";

interface PhotoSectionProps {
    isLoggedIn: boolean;
    loggedInUser: any;
    selectedPremises: Feature<Polygon> | null;
}

const styles = StyleSheet.create({
    listItem: {
        paddingLeft: 16,
        flex: 1,
    },
    imageContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    image: {
        height: 90,
        width: 90,
        marginHorizontal: 5,
        borderRadius: 5
    },
})

export function PhotoSection({isLoggedIn, loggedInUser, selectedPremises}: PhotoSectionProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [pictures, setPictures] = useState<[]>([]);

    useEffect(() => {
        if (selectedPremises) {
            downloadPremisesImages({selectedPremises: selectedPremises, setPictures, setLoading});
        }
    }, [selectedPremises]);

    const handleModalClose = () => {
        setSelectedImageIndex(null);
    };

    const handleImagePress = (index: number) => {
        setSelectedImageIndex(index);
    };

    return <>
        <List.Section>
            <List.Subheader>Foto's</List.Subheader>
            {loading ? (
                <ActivityIndicator/>
            ) : pictures.length === 0 ? (
                <List.Item
                    title="Geen foto's beschikbaar"
                    left={() => <List.Icon icon="camera-off" color="black"/>}
                    style={styles.listItem}
                />
            ) : (
                <ScrollView horizontal={true} contentContainerStyle={styles.imageContainer}>
                    {pictures.map((image: any, index: any) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                            <Image
                                source={{uri: image}}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            {!loading && isLoggedIn && loggedInUser?.isOwner && selectedPremises?.properties?.ownerId === loggedInUser?.uid && (
                <List.Item
                    title="Foto toevoegen"
                    left={() => <List.Icon icon="camera-plus" color="black"/>}
                    style={styles.listItem}
                    onPress={() => pickPremisesImage({
                        selectedPremises: selectedPremises,
                        setPictures,
                        setLoading
                    })}
                />
            )}
        </List.Section>

        {selectedImageIndex !== null && (
            <ImageModal picture={pictures[selectedImageIndex]}
                        handleModalClose={handleModalClose}/>
        )}
    </>
}
