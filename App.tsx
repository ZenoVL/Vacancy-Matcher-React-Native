import {Register} from "./screens/Register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {PremisesMap} from "./screens/PremisesMap";
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {Login} from "./screens/Login";
import {Profile} from "./screens/Profile";
import {Logout} from "./screens/Logout";
import {Provider} from 'react-native-paper';
import {ApproveOwner} from "./screens/ApproveOwner";
import {ChatView} from "./screens/ChatView";
import {ChatOverview} from "./screens/ChatOverview";
import {PropertyList} from "./screens/PropertyList";
import {UserList} from "./screens/UserList";
import {Notifications} from "./components/notifications/Notifications";
import * as Notification from "expo-notifications"
import {CreatedPremises} from "./screens/CreatedPremises";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./firebaseConfig";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const queryClient = new QueryClient()
const app = initializeApp(firebaseConfig);

export type RootStackParamList = {
    Register: undefined;
    Login: undefined;
    Logout: undefined;
    Profile: undefined;
    Map: { premisesId: string }
    ChatOverview: undefined;
    ChatView: { chatId: string };
    PropertyList: { propId: string };
    ApproveOwner: {
        premisesId: number
    };
    CreatedPremises: {
        coordinates: any,
        ownerId: string | undefined
        selectedPremises: any
    };

    UserList: {
        propertyId: string
    },
    Notifications: undefined
    // Settings: {
    //     userId: number;
    // };
    // is een voorbeeld: https://javascript.plainenglish.io/react-navigation-v6-with-typescript-5c9c065d45a5
};

Notification.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowAlert: true
        }
    }
})

export default function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
        <GestureHandlerRootView style={{flex: 1}}>

            <Provider>
                <QueryClientProvider client={queryClient}>
                    <Notifications>
                        <NavigationContainer>
                            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Map">
                                <Stack.Screen name="Register" component={Register}/>
                                <Stack.Screen
                                    name="ChatOverview"
                                    component={ChatOverview}
                                />
                                <Stack.Screen name="ChatView" component={ChatView}/>
                                <Stack.Screen name="PropertyList" component={PropertyList}/>
                                <Stack.Screen name={"UserList"} component={UserList}/>
                                <Stack.Screen name={"Login"} component={Login}/>
                                <Stack.Screen name={"Logout"} component={Logout}/>
                                <Stack.Screen name={"Profile"} component={Profile}/>
                                <Stack.Screen
                                    name="Map" component={PremisesMap} options={{title: 'Map'}}/>
                                <Stack.Screen name={"ApproveOwner"} component={ApproveOwner}/>
                                <Stack.Screen name={"CreatedPremises"} component={CreatedPremises}/>
                            </Stack.Navigator>
                        </NavigationContainer>
                    </Notifications>
                </QueryClientProvider>
            </Provider>
        </GestureHandlerRootView>
    );
}
