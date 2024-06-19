import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  Button,  StyleSheet,  Text,  TextInput,  TouchableOpacity,  View, Pressable} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Svg, {  SvgProps,  Path,  Defs,  Pattern,  Use,  Image,} from "react-native-svg"
import { LinearGradient } from 'expo-linear-gradient';
import Navigation from './Navegacion';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  function SvgInicio(){
    return(
      <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={430}
      height={306}
      fill="none"
    >
      <Path
        fill="url(#a)"
        d="M0 0h430v256c0 27.614-22.386 50-50 50H50c-27.614 0-50-22.386-50-50V0Z"
      />
      <Defs>
        <Pattern
          id="a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <Use
            xlinkHref="#b"
            transform="matrix(.00233 0 0 .00314 -1.974 -1.693)"
          />
        </Pattern>
        <Image
          id="b"
          width={1280}
          height={853}
        />
      </Defs>
    </Svg>
    )
  }
  
  return (
    <View style={styles.container}>
    <View style={styles.containerSvg}>
      <SvgInicio/>
    </View>   
      <Text style={styles.txtTitulo}>Bienvenidos!</Text>
      <Text style={styles.txtSubtitulo}>Ingresar con tu cuenta</Text>
      <TextInput placeholder='multimedios@gmail.com' style={styles.txtInput}></TextInput>
      <TextInput placeholder='contraseña' secureTextEntry={true} style={styles.txtInput}></TextInput>

      <TouchableOpacity >   
      <Text style={styles.txtPass}>¿Has olvidado su contraseña?</Text>
      </TouchableOpacity>      
      
      <TouchableOpacity >
      <LinearGradient
        colors={['#00C1BB', '#005B58']}
        start={{x:0, y:0}}
        end={{x:1, y:1}}
        style={styles.btnLogin}
        >
        <Text style={styles.txtLogin} >Iniciar sesión</Text>
      </LinearGradient>     
      </TouchableOpacity>

      {/* <Button title='Iniciar Sesion' style={styles.btnLogin} /> */}

      <Text style={styles.txtCuenta}>No tiene cuenta?</Text>
      <TouchableOpacity >
      <Text style={styles.txtRegistrarse}>Registrarse</Text>
      </TouchableOpacity> 
      
      <StatusBar style="auto" />

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Navigation/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },

  containerSvg:{
    alignItems: 'center',
  },

  txtTitulo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#34434D',
    textAlign: 'left',
    paddingLeft: 30,

  },
  txtSubtitulo: {
    fontSize: 20,
    fontWeight: 'light',
    color: 'gray',
    textAlign: 'left',
    paddingLeft: 30,
    marginTop: 20,
  },

  txtInput: {
    width: '80%',
    height: 50,
    borderRadius: 30,
    paddingLeft: 30,
    marginTop: 20,
    marginLeft: 30,
    borderColor: 'gray',
    color: '#000000',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 4,
    shadowRadius: 10,
    elevation: 10,
  },

  txtPass: {
    textAlign: 'right',
    paddingTop: 10,
    marginRight: 50,
    color: '#00C1BB',
    fontSize: 15,
  },

  btnLogin: {
    borderRadius: 30,
    width: 219,
    height: 53,
    marginTop:35,
    marginLeft: 80,
    paddingTop:10,
  },

  txtLogin:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
   
  },

  txtCuenta: {
    textAlign: 'center',
    paddingTop: 10,
    color: '#00C1BB',
    fontSize: 15,
    alignItems:'center',
  },

  txtRegistrarse: {
    textAlign: 'center',
    color: '#00C1BB',
    fontSize: 15,
    alignItems:'center',
    fontWeight: 'bold',
  },

});
