import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../accesoFirebase';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation para navegación
import UserContext from './UserContext';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function LoginScreen() {
  const { setUserEmail } = useContext(UserContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
      }
  
      const q = query(collection(db, 'accounts'), where('correo', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert('Error', 'El correo electrónico ingresado no está registrado.');
        return;
      }
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.contraseña !== password) {
          Alert.alert('Error', 'La contraseña ingresada es incorrecta.');
          return;
        }
  
        // Navegar a HomeScreen con el parámetro userEmail
        setUserEmail(email);
        navigation.navigate('HomeScreen');
      });
      
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Image source={require('../images/logo_2.png')} style={styles.topRightImage} />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.txtSubtitulo}>Ingresar con tu cuenta</Text>
        <TextInput
          placeholder='Correo Electrónico'
          style={styles.txtInput}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder='Contraseña'
          secureTextEntry={true}
          style={styles.txtInput}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.txtPass}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin}>
          <LinearGradient
            colors={['green', '#005B58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnLogin}
          >
            <Text style={styles.txtLogin}>Iniciar sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.txtCuenta}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.txtRegistrarse}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D9D9D9',
    flex: 1,
  },
  halfBackground: {
    height: '50%',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRightImage: {
    position: 'absolute',
    top: 8,
    right: 0,
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginTop: -155,
    alignItems: 'center',
  },
  txtSubtitulo: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 0,
  },
  txtInput: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    paddingLeft: 30,
    marginTop: 20,
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
    textAlign: 'center',
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  btnLogin: {
    borderRadius: 30,
    width: 219,
    height: 53,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLogin: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  txtCuenta: {
    textAlign: 'center',
    paddingTop: 10,
    color: 'green',
    fontSize: 15,
    marginTop: 10,
  },
  txtRegistrarse: {
    textAlign: 'center',
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
