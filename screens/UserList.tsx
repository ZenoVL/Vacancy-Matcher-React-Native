import React, { useEffect, useState } from 'react';
import {View, Text, Image, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native';
import { getUsersWithFavoritePremise } from "../services/PropertiesService";
import { User } from "../models/User";
import FooterNavigation from "../components/NavigationFooter";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        marginTop: 60
    },
    userListContainer: {
        width: width,
        paddingHorizontal: 20,
    },
    userContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    organisation:{
        fontSize: 16,
        fontWeight: 'bold',
        width: "80%",
        textAlign: "right",
        flex: 1
    }
});

interface UserListProps {
    route: {
        params: {
            propertyId: string;
        };
    };
}

export function UserList(userListProps: UserListProps): JSX.Element {
    const [users, setUsers] = useState<User[]>([]);

    const propertyId = userListProps.route.params.propertyId;

    useEffect(() => {
        async function fetchData() {
            const userdata = await getUsersWithFavoritePremise(propertyId);
            setUsers(userdata);
        }

        fetchData().then(r => console.log(propertyId));
    }, [propertyId]);

    const renderItem = ({item}: { item: User }) =>{
        return (
            <View style={styles.userContainer}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <Text style={styles.username}>{!item.isAnonymous?item.name:"anoniem"}</Text>
                <Text style={styles.organisation}>{item.isOrganisation?"organisatie":"persoonlijk"}</Text>
            </View>
            )
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.userListContainer}>
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                    />
                </View>
            </View>
            <FooterNavigation/>
        </>
    );
}
