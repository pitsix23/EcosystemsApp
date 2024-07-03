import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../accesoFirebase';
import UserContext from './UserContext';

const  UpdtPasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { userEmail } = useContext(UserContext);
  console.log('User Email:', userEmail);
  const handleUpdatePassword = async () => {
    try {
      const colRef = collection(db, 'accounts');
      const q = query(colRef, where('correo', '==', userEmail)); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const storedPassword = userData.contraseña; 

        if (currentPassword !== storedPassword) {
          Alert.alert('Error', 'La contraseña actual no es válida.');
          return;
        }
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { contraseña: newPassword, confirmContraseña: newPassword }); 

        Alert.alert('Contraseña actualizada', 'Tu contraseña ha sido actualizada correctamente.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'No se encontró ninguna cuenta asociada a este correo electrónico.');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la contraseña.');
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
        <Text style={styles.title}>Actualizar Contraseña</Text>
        <View style={styles.inputContainer}>
          <Image source={require('../images/key (1).png')} style={styles.ficon} />
          <TextInput
            placeholder="Contraseña Actual"
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Image source={require('../images/key.png')} style={styles.ficon} />
          <TextInput
            placeholder="Nueva Contraseña"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity onPress={handleUpdatePassword}>
          <LinearGradient
            colors={['#00C164', '#005B58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Actualizar Contraseña</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    marginTop: -105,
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
    marginTop: 10,
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
export default UpdtPasswordScreen;