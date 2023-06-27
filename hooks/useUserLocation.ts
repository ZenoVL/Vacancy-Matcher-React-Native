import {useEffect, useState} from "react";
import * as Location from 'expo-location';

export function useUserLocation() {
    const [userLocation, setUserLocation] = useState<any>(null);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 10
            }, (newLocation) => {
                setUserLocation(newLocation);
            });

        })();
    }, []);

    return userLocation;
}

