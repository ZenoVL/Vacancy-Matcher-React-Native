import {Feature, Polygon} from 'geojson';
import {child, get, getDatabase, onChildAdded,onChildRemoved, onChildChanged, push, ref, set, update} from 'firebase/database';
import {database} from "../firebaseConfig";

interface getPremisesDataProps {
    setGeoJsonData: (geoJsonData: any) => void,
    setLoading: (loading: boolean) => void
}

export function getPremisesData({setGeoJsonData, setLoading}: getPremisesDataProps) {
    const premisesRef = ref(database, 'Premises');
    const features: Feature<Polygon>[] = [];

    setGeoJsonData([]); // Clear the data

    // First, get all the existing data
    get(premisesRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const feature: Feature<Polygon> = {
                type: childSnapshot.val().type,
                geometry: childSnapshot.val().geometry,
                properties: childSnapshot.val().properties
            };
            features.push(feature);
        });
        setGeoJsonData(features);
        setLoading(false);
    }).catch((error) => {
        console.log(error);
        setLoading(false);
        alert("Er is iets misgegaan met het ophalen van de gegevens. Probeer het later opnieuw.");
    });

    onChildAdded(premisesRef, (snapshot) => {
        const feature: Feature<Polygon> = {
            type: snapshot.val().type,
            geometry: snapshot.val().geometry,
            properties: snapshot.val().properties
        };
        setGeoJsonData((prevDataList: Feature<Polygon>[]) => [...prevDataList, feature]);
    });

    onChildChanged(premisesRef, (snapshot) => {
        const updatedFeature: Feature<Polygon> = {
            type: snapshot.val().type,
            geometry: snapshot.val().geometry,
            properties: snapshot.val().properties
        };
        setGeoJsonData((prevDataList: Feature<Polygon>[]) => {
            return prevDataList.map((feature) => {
                if (feature.properties?.OBJECTID === updatedFeature.properties?.OBJECTID) {
                    return updatedFeature;
                }
                return feature;
            });
        });
    });

    onChildRemoved(premisesRef, (snapshot) => {
        const deletedFeature: Feature<Polygon> = {
            type: snapshot.val().type,
            geometry: snapshot.val().geometry,
            properties: snapshot.val().properties
        };
        setGeoJsonData((prevDataList: Feature<Polygon>[]) => {
            return prevDataList.filter((feature) => {
                return feature.properties?.OBJECTID !== deletedFeature.properties?.OBJECTID;
            });
        });
    });
}

interface updatePremisesProps {
    feature: Feature<Polygon>,
    selectedPremisesId: string | number
}


export async function updatePremises({feature, selectedPremisesId}: updatePremisesProps) {
    try {
        const premisesRef = ref(database, 'Premises');
        const updates: any = {};

        for (const property in feature.properties) {
            if (feature.properties[property] !== undefined) {
                updates[`/${selectedPremisesId}/properties/${property}`] = feature.properties[property];
            } else {
                updates[`/${selectedPremisesId}/properties/${property}`] = null;
            }
        }

        await update(premisesRef, updates);
        alert("De gegevens zijn opgeslagen.")

    } catch (error) {
        console.log(error);
        alert("Er is iets misgegaan met het opslaan van de gegevens. Probeer het later opnieuw.");
    }
}

export async function addPremises(premises: Feature<Polygon>) {
    try {
        const newPremisesRef = push(ref(database, 'Premises'));
        const OBJECTID = newPremisesRef.key;
        const premisesWithId = {...premises, properties: {...premises.properties, OBJECTID}};
        await set(newPremisesRef, premisesWithId);
        alert("De gegevens zijn opgeslagen.")
    } catch (error) {
        console.log(error);
        alert("Er is iets misgegaan met het opslaan van de gegevens. Probeer het later opnieuw.");
    }
}

export async function getPropertyData(propertyId: string) {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `Premises/${propertyId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const propertyData = snapshot.val();
                return propertyData;
            } else {
                console.log("No data available");
                return null;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

interface toAddressProps{
    city:string,
    zipCode:string
    street:string
    houseNr: string
    busNr:string
}

export function toAddress({city, zipCode, street, houseNr, busNr}:toAddressProps){
    return street +" " + houseNr + "" + (busNr===undefined?"":busNr+" ") + ", " + zipCode + " " + city
}
