import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getPremisesWithOwner} from "../services/PropertiesService";
import {addNewChatWithMessage, addNewFavoritePremise, removeFavoritePremise} from "../services/ChatService";
import {PremiseDto} from "../models/dto/PremiseDto";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {PropertyFlatList} from "../components/propertylist/PropertyFlatList";
import {PropertyFilter} from "../components/propertylist/PropertyFilter";
import {Button, TextInput} from "react-native-paper";
import {FormFieldCheckBox} from "../components/form/FormFieldCheckBox";
import {Loading} from "../components/Loading";
import {useSendNotification} from "../hooks/useNotifications";
import {getUserData} from "../services/UserService";
import { User } from '../models/User';
import { toAddress } from '../services/PremisesService';
import {useGetLoggedInUser} from "../hooks/useUsers";
import {globalStyle} from "../styles/globalStyle";
import FooterNavigation from "../components/NavigationFooter";

const RECORDS_PER_FETCH = 100;

export const PropertyList = (props?: { route: { params: { propId?: string; } } }) => {
    let propId : string | undefined = undefined
    try {
        propId = props?.route.params.propId
    } catch{}


    const [showRequestMessage, setShowRequestMessage] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);


    const [filterState, setFilterState] = useState('');
    const [filterSize, setFilterSize] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterHasOwner, setFilterHasOwner] = useState<boolean>(true)
    const [filterFavorite, setFilterFavorite] = useState(false);
    const [changeFilter, setChangeFilter] = useState<number>(0)

    const toggleFilters = () => setShowFilters(!showFilters);

    const [premises, setPremises] = useState<PremiseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [startAt, setStartAt] = useState<number>(0)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const {mutate:sendNotification} = useSendNotification()
    const {isLoading:isLoadingUser, data:loggedInUser} = useGetLoggedInUser()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        setIsLoading(true)
        const fetchPremises = async () => {
            const premisesNext = await getPremisesWithOwner({hasOwner: filterHasOwner, size: RECORDS_PER_FETCH, startAt: 0, area: filterSize, type: filterType, state: filterState, id:propId});
            setStartAt(premisesNext[premisesNext.length-1]?.premise.properties.OBJECTID)
            setPremises(premisesNext);
            setIsLoading(false)
        };

        fetchPremises();
    }, [filterHasOwner, changeFilter]);

    if(isLoadingUser){
        return <><View style={{flex: 1, justifyContent:"center"}}><Loading/></View><FooterNavigation/></>
    }

    if(loggedInUser===undefined||loggedInUser===null){
        return <><View style={{flex: 1, justifyContent: "center", alignItems: "center"}}><Text>Meld u aan om dit scherm te kunnen zien</Text><Button icon={"login"} mode={"contained"} style={[globalStyle.Button]} onPress={() => navigation.navigate("Login")}>Aanmelden</Button></View><FooterNavigation/></>
    }

    if(isLoading){
        return <><View style={{flex: 1, justifyContent:"center"}}><Loading/></View><FooterNavigation/></>
    }

    async function getNextPremises(){
        if(!isFetching && (!propId || startAt == 0)){
            setIsFetching(true)
            const premisesNext = await getPremisesWithOwner({hasOwner: filterHasOwner, size: RECORDS_PER_FETCH, startAt: startAt, area: filterSize, type: filterType, state: filterState, id:propId});
            if(premisesNext[premisesNext.length-1]!==undefined){
                setStartAt(premisesNext[premisesNext.length-1].premise.properties.OBJECTID)
            }
            premisesNext.forEach((p)=>{
                premises.push(p)
            })
            setPremises(premises)
            setIsFetching(false)
        }
    }

    const handleAddToFavorites = (property: PremiseDto) => {
        const newFavoritePremise = async () => {
            await addNewFavoritePremise(property.premise.properties.OBJECTID);
            const user:User = await getUserData(property.premise.properties.ownerId)
            if (user) sendNotification({to: user.notificationTokens, title: "added to favorite", body: `someone added ${toAddress({city: property.premise.properties.pnd_district, zipCode: property.premise.properties.pnd_district_code, street: property.premise.properties.pva_straat, houseNr: property.premise.properties.pva_huisnr1, busNr: property.premise.properties.pva_huisnr2})} to the favorite list`})
        };
        const removedFavoritePremise = async () => {
            await removeFavoritePremise(property.premise.properties.OBJECTID);
        };

        const updatePremisess = () => {
            const newPremises = [...premises];
            const index = newPremises.findIndex((premise) => premise.premise.properties.OBJECTID == property.premise.properties.OBJECTID);
            newPremises[index].isFavorite = !property.isFavorite;
            if (!property.isFavorite) newPremises[index].favoritesCount -= 1;
            else newPremises[index].favoritesCount += 1;
            setPremises(newPremises);
        }

        if (!property.isFavorite) newFavoritePremise().then(() => updatePremisess());
        else removedFavoritePremise().then(() => updatePremisess());
    }

    const handleRequestToUse = (property: PremiseDto) => {
        setShowRequestMessage(true);
        setRequestMessage('');
        setSelectedPropertyId(property.premise.properties.OBJECTID);
    };

    const handleRequestSubmit = () => {
        if (requestMessage.trim() === '') {
            alert('Please enter a message');
            return;
        }

        const newChatWitMessage = async () => {
            await addNewChatWithMessage(selectedPropertyId, requestMessage);
        };
        newChatWitMessage().then(() => {
            alert('Verzoek is verstuurd!');
            setShowRequestMessage(false);
            setRequestMessage('');
        });
    };

    const handleRequestCancel = () => {
        setShowRequestMessage(false);
        setRequestMessage('');
        setSelectedPropertyId(null);
    };

    return (
        <>
            <View style={styles.header}>
                <PropertyFilter filterFavorite={filterFavorite} setFilterFavorite={setFilterFavorite} toggleFilters={toggleFilters} />
            </View>
            {showFilters && (
                <View style={styles.filterContainer}>
                    <TextInput
                        style={styles.input}
                        label="Filter conditie"
                        value={filterState}
                        onChangeText={setFilterState}
                    />
                    <TextInput
                        style={styles.input}
                        label="Filter grootte (m²)"
                        value={filterSize}
                        onChangeText={setFilterSize}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        label="Filter type"
                        value={filterType}
                        onChangeText={setFilterType}
                    />
                    <Text>Filter eigenaar</Text>
                    <FormFieldCheckBox labelChecked={"heeft eigenaar"} labelUnchecked={"heeft eigenaar"} value={filterHasOwner} onChange={()=>setFilterHasOwner(!filterHasOwner)}/>
                    <Button icon={"filter"} mode={"contained"} style={globalStyle.Button} onPress={()=>setChangeFilter(changeFilter+1)}>Filters toepassen</Button>
                </View>
            )}
                <PropertyFlatList filteredProperties={premises} isFetching={isFetching} loggedInUser={loggedInUser}
                                  handleAddToFavorites={handleAddToFavorites} handleRequestToUse={handleRequestToUse}
                                  handleRequestCancel={handleRequestCancel} handleRequestSubmit={handleRequestSubmit}
                                  requestMessage={requestMessage} selectedPropertyId={selectedPropertyId!}
                                  setRequestMessage={setRequestMessage} showRequestMessage={showRequestMessage} onEndReached={()=>getNextPremises()}>
                </PropertyFlatList>
            <FooterNavigation/>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#f9f9f9',
        paddingVertical: 20,
        paddingHorizontal: 20,
        height: 100,
        paddingTop: 50,
    },
    filterContainer: {
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    input: {
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
