import {Button, TextInput, List} from "react-native-paper";
import React, {useState} from "react";
import {Platform, ScrollView, StyleSheet, View, Text} from "react-native";
import {Feature, Polygon} from "geojson";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {addPremises, updatePremises} from "../services/PremisesService";
import {LatLng} from "react-native-maps";
import {globalStyle} from "../styles/globalStyle";
import {FormFieldCheckBox} from "../components/form/FormFieldCheckBox";
import FooterNavigation from "../components/NavigationFooter";

type Props = NativeStackScreenProps<RootStackParamList, 'CreatedPremises'>;

export function CreatedPremises({route, navigation}: Props) {
    const coordinates = route.params?.coordinates;
    const ownerId = route.params?.ownerId;
    const selectedPremises = route.params?.selectedPremises;

    const [pva_straat, setPva_straat] = useState(selectedPremises ? selectedPremises.properties.pva_straat : '');
    const [pva_huisnr1, setPva_huisnr1] = useState(selectedPremises ? selectedPremises.properties.pva_huisnr1 : '');
    const [pva_huisnr2, setPva_huisnr2] = useState(selectedPremises ? selectedPremises.properties.pva_huisnr2 : '');
    const [pva_postcode, setPva_postcode] = useState(selectedPremises ? selectedPremises.properties.pva_postcode : '');
    const [pnd_district, setPnd_district] = useState(selectedPremises ? selectedPremises.properties.pnd_district : '');
    const [SHAPE_Area, setSHAPE_Area] = useState(selectedPremises ? selectedPremises.properties.SHAPE_Area : '');
    const [SHAPE_Length, setSHAPE_Length] = useState(selectedPremises ? selectedPremises.properties.SHAPE_Length : '');
    const [reg_aard, setReg_aard] = useState(selectedPremises ? selectedPremises.properties.reg_aard : '');
    const [price, setPrice] = useState(selectedPremises ? selectedPremises.properties.price : '');
    const [description, setDescription] = useState(selectedPremises ? selectedPremises.properties.description : '');
    const [centraleVerwarmingAanwezig, setCentraleVerwarmingAanwezig] = useState(selectedPremises ? selectedPremises.properties.centraleVerwarmingAanwezig : '');
    const [krachtstroomMogelijk, setKrachtstroomMogelijk] = useState(selectedPremises ? selectedPremises.properties.krachtstroomMogelijk : '');
    const [electriciteitAanwezig, setElectriciteitAanwezig] = useState(selectedPremises ? selectedPremises.properties.electriciteitAanwezig : '');
    const [waterAansluitingAanwezig, setWaterAansluitingAanwezig] = useState(selectedPremises ? selectedPremises.properties.waterAansluitingAanwezig : '');
    const [staat, setStaat] = useState(selectedPremises ? selectedPremises.properties.staat : '');
    const [expanded, setExpanded] = useState(true);
    const [expanded2, setExpanded2] = useState(true);
    const [aantalVerdiepingen, setAantalVerdiepingen] = useState(selectedPremises ? selectedPremises.properties.aantalVerdiepingen : '');
    const [pva_straatError, setPva_straatError] = useState(false);
    const [pva_huisnr1Error, setPva_huisnr1Error] = useState(false);
    const [pva_postcodeError, setPva_postcodeError] = useState(false);
    const [pnd_districtError, setPnd_districtError] = useState(false);

    const handlePress = () => setExpanded(!expanded);
    const handlePress2 = () => setExpanded2(!expanded2);

    async function handleSave() {

        if (pva_straat === '') {
            setPva_straatError(true)
        }
        if (pva_huisnr1 === '') {
            setPva_huisnr1Error(true)
        }
        if (pva_postcode === '') {
            setPva_postcodeError(true)
        }
        if (pnd_district === '') {
            setPnd_districtError(true)
        }

        if (pva_straat === '' || pva_huisnr1 === '' || pva_postcode === '' || pnd_district === '') {
            alert('Vul alle verplichte adresgegevens in')
            return
        }

        let convertedCoordinates: any = []

        if (coordinates !== undefined) {
            if (Platform.OS === 'web') {
                coordinates.forEach((coordinate: any) => {
                    convertedCoordinates.push([coordinate.lng, coordinate.lat])
                })
            } else {
                coordinates.forEach((coordinate: LatLng) => {
                    convertedCoordinates.push([coordinate.longitude, coordinate.latitude])
                })
            }
        }

        const feature: Feature<Polygon> = ({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [convertedCoordinates]
            },
            properties: {
                pva_straat,
                pva_huisnr1,
                pva_huisnr2,
                pva_postcode,
                pnd_district,
                SHAPE_Area: parseFloat(SHAPE_Area) || "",
                SHAPE_Length: parseFloat(SHAPE_Length) || "",
                reg_aard,
                price: parseFloat(price) || "",
                description,
                aantalVerdiepingen: parseInt(aantalVerdiepingen) || "",
                staat,
                waterAansluitingAanwezig,
                electriciteitAanwezig,
                krachtstroomMogelijk,
                centraleVerwarmingAanwezig,
                ownerId
            },
        });

        if (selectedPremises) {
            await updatePremises({feature: feature, selectedPremisesId: selectedPremises.properties.OBJECTID})
        } else {
            await addPremises(feature)
        }

        navigation.navigate('Map' as any)
    }

    const handleDismiss = () => {
        navigation.navigate('Map' as any)
    }

    return <>
        <View style={styles.view}>
            <ScrollView style={styles.container}>
                <List.Section style={{alignItems: "center"}}>
                    <List.Accordion onPress={handlePress} left={() => <List.Icon icon="map-marker"/>}
                                    expanded={expanded}
                                    title={'Adresgegevens'}>
                        <TextInput
                            label="Straat"
                            value={pva_straat}
                            error={pva_straatError}
                            onChangeText={setPva_straat}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Huisnr"
                            value={pva_huisnr1}
                            error={pva_huisnr1Error}
                            onChangeText={setPva_huisnr1}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Huisnr 2"
                            value={pva_huisnr2}
                            onChangeText={setPva_huisnr2}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Postcode"
                            value={pva_postcode}
                            error={pva_postcodeError}
                            onChangeText={setPva_postcode}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="District"
                            value={pnd_district}
                            error={pnd_districtError}
                            onChangeText={setPnd_district}
                            style={globalStyle.textInput}
                        />
                    </List.Accordion>
                </List.Section>

                <List.Section style={{alignItems:"center"}}>
                    <List.Accordion onPress={handlePress2} left={() => <List.Icon icon="home"/>} expanded={expanded2}
                                    title={'Pand informatie'}>
                        <TextInput
                            label="Beschrijving"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Oppervlakte"
                            value={SHAPE_Area.toString()}
                            onChangeText={setSHAPE_Area}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Lengte"
                            value={SHAPE_Length.toString()}
                            onChangeText={setSHAPE_Length}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Type"
                            value={reg_aard}
                            onChangeText={setReg_aard}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Prijs per maand"
                            value={price?.toString()}
                            onChangeText={setPrice}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Conditie van het pand"
                            value={staat}
                            onChangeText={setStaat}
                            style={globalStyle.textInput}
                        />
                        <TextInput
                            label="Aantal verdiepingen"
                            keyboardType='numeric'
                            value={aantalVerdiepingen?.toString()}
                            onChangeText={setAantalVerdiepingen}
                            style={globalStyle.textInput}
                        />
                        <Text style={{paddingLeft: 10}}>Verwarming aanwezig</Text>
                        <FormFieldCheckBox labelChecked={"ja"} labelUnchecked={"nee"} value={centraleVerwarmingAanwezig} onChange={() => setCentraleVerwarmingAanwezig(!centraleVerwarmingAanwezig)}/>
                        <Text style={{paddingLeft: 10}}>Krachtstroom mogelijk</Text>
                        <FormFieldCheckBox labelChecked={"ja"} labelUnchecked={"nee"} value={krachtstroomMogelijk} onChange={() => setKrachtstroomMogelijk(!krachtstroomMogelijk)}/>
                        <Text style={{paddingLeft: 10}}>Electriciteit aanwezig</Text>
                        <FormFieldCheckBox labelChecked={"ja"} labelUnchecked={"nee"} value={electriciteitAanwezig} onChange={() => setElectriciteitAanwezig(!electriciteitAanwezig)}/>
                        <Text style={{paddingLeft: 10}}>Water aansluiting aanwezig</Text>
                        <FormFieldCheckBox labelChecked={"ja"} labelUnchecked={"nee"} value={waterAansluitingAanwezig} onChange={() => setWaterAansluitingAanwezig(!waterAansluitingAanwezig)}/>
                    </List.Accordion>
                </List.Section>

                <View style={globalStyle.ButtonContainer}>
                    <Button onPress={handleDismiss} icon="close" style={globalStyle.Button} mode="contained">
                        Annuleren
                    </Button>
                    <Button icon="content-save" style={globalStyle.Button} mode="contained" onPress={handleSave}>
                        Opslaan
                    </Button>
                </View>
            </ScrollView>
        </View>
        <FooterNavigation/>
    </>
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 60
    },
    container: {
        padding: 16,
        marginBottom: 16
    },
    input: {
        marginBottom: 8,
        width: "100%",
        maxWidth: 400,

    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        marginHorizontal: 40,
        backgroundColor: globalStyle.premises.color,
        marginBottom: 20,
    },
});
