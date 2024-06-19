import React from "react"
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home1 = () =>{
    const navigation = useNavigation();
    return (
        <View>
            <Text>Home1</Text>
            <TouchableOpacity
                OnPress={()=> navigation.navigate("Home2")}>
                
            </TouchableOpacity>
        </View>
        
    );
    
}

export default Home1;