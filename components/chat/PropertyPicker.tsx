import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity, Image, Text} from 'react-native';
import { PropertyDto } from '../../models/dto/PropertyDto';
import {downloadPremisesImages} from "../../services/storageService";

type Props = {
    properties: PropertyDto[] | null;
    selectedProperty: string | undefined;
    onSelectProperty: (value: string | undefined) => void;
};

export function PropertyPicker({ properties, selectedProperty, onSelectProperty }: Props): JSX.Element {

    return (
        <View style={styles.filterContainer}>
            <FlatList
                data={[{ id: undefined, name: 'Alle panden' }, ...(properties || [])]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.propertyItem,
                            selectedProperty === item.id && styles.selectedPropertyItem,
                        ]}
                        onPress={() => onSelectProperty(item.id)}
                    >
                        <Text style={styles.propertyName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: '#eee',
        padding: 10,
    },
    propertyItem: {
        backgroundColor: '#fff',
        marginRight: 10,
        borderRadius: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedPropertyItem: {
        backgroundColor: '#db9534',
    },
    propertyImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    propertyName: {
        textAlign: 'center',
        fontSize: 12,
        padding: 5
    },
});
