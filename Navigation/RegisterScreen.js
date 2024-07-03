import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../accesoFirebase';
import { LinearGradient } from 'expo-linear-gradient';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }
      const docRef = await addDoc(collection(db, 'accounts'), {
        nombre: name,
        correo: email,
        contraseña: password, 
        confirmContraseña: confirmPassword,
      });

      Alert.alert('Registro exitoso', 'El usuario ha sido registrado exitosamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registrando el usuario:', error);
      Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
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
        <Text style={styles.title}>Crear Cuenta Nueva</Text>
          <View style={styles.inputContainer}>
          <Image source={require('../images/user.png')} style={styles.ficon} />
          <TextInput
            placeholder='Nombre'
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/mail.png')} style={styles.ficon} />
          <TextInput
            placeholder='Correo Electrónico'
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/key (1).png')} style={styles.ficon} />
          <TextInput
            placeholder='Contraseña'
            secureTextEntry={true}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/key.png')} style={styles.ficon} />
          <TextInput
            placeholder='Confirmar Contraseña'
            secureTextEntry={true}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity onPress={handleRegister}>
          <LinearGradient
            colors={['#00C164', '#005B58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9', 
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 10,
    padding: 20,
    marginTop: -175, 
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#837B7B',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    paddingVertical: 15,
    paddingLeft: 40, // Ajusta el padding para que el ícono esté alineado con el texto
    marginTop: 10,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    shadowColor: '#837B7B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    borderRadius: 30,
    width: 219,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topRightImage: {
    position: 'absolute',
    top: 8,
    right: 0,
    width: 180, 
    height: 180,
    resizeMode: 'contain',
  },
  ficon: {
    position: 'absolute',
    left: 10,
    top: 24,
    width: 20,
    height: 20,
    zIndex: 1,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
});
