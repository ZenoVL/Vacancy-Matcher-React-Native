import {Image, Modal, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {MaterialIcons} from "@expo/vector-icons";

interface ImageModalProps {
    picture: string;
    handleModalClose: () => void;
}

export function ImageModal({picture, handleModalClose}: ImageModalProps) {
    return (
        <Modal visible={true} onRequestClose={handleModalClose}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                    <MaterialIcons name="close" size={24} color="white"/>
                </TouchableOpacity>
                <Image
                    source={{uri: picture}}
                    style={{width: '100%', height: '100%', resizeMode: 'contain'}}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 10,
        zIndex: 1,
        width: 30,
        height: 30,
    }
});


