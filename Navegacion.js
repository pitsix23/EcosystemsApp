import React from "react"
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer} from "@react-navigation/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Home1 from "./Navigation/Home1";
import Home2 from "./Navigation/Home2";
import HomeBtn from "./Navigation/HomeBtn";

const TabNav = createBottomTabNavigator();
function Tabs (){
    return (
        <TabNav.Navigator
            initialRouteName="HomeStack"
            screenOptions={{tabBarActiveTintColor: 'green',
            }}
        >
            <TabNav.Screen
            name="Home1"
            component={Home1}
            />
            <TabNav.Screen
            name="Home2"
            component={Home2}
            /*options={{
            }}*/
            />
        </TabNav.Navigator>
    )
};

export default function Navigation (){
    return (
        <NavigationContainer>
            <Tabs></Tabs>
        </NavigationContainer>
    )
}