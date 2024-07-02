import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../accesoFirebase';
import UserContext from './UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { userEmail } = useContext(UserContext); // Obtener el correo electrónico desde las props de navegación
  console.log('User Email:', userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Construir la consulta para obtener datos del perfil basados en el correo electrónico
        const colRef = collection(db, 'accounts');
        const q = query(colRef, where('correo', '==', userEmail));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setName(userData.nombre);
          setEmail(userData.correo);
          if (userData.edad !== undefined) {
            setAge(userData.edad.toString());
          }
        } else {
          Alert.alert('Error', 'No se encontraron datos de perfil para este usuario.');
        }
      } catch (error) {
        console.error('Error obteniendo datos de perfil:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos de perfil.');
      }
    };
  
    fetchUserProfile();
  }, [userEmail]);

  const handleUpdateProfile = async () => {
    try {
      // Construir la consulta para actualizar datos del perfil basados en el correo electrónico
      const colRef = collection(db, 'accounts');
      const q = query(colRef, where('correo', '==', userEmail));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs[0].data();
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const storedPassword = userData.contraseña;
        if (currentPassword !== storedPassword) {
          Alert.alert('Error', 'La contraseña actual no es válida.');
          return;
        }

        // Crear un objeto de actualización que solo incluya la contraseña si se ha proporcionado
        const updatedData = {
          nombre: name,
          correo: email,
          edad: parseInt(age),
        };

        if (password.trim() !== '') {
          updatedData.contraseña = password;
          updatedData.confirmContraseña = password;
        }

        await updateDoc(docRef, updatedData);

        Alert.alert('Perfil actualizado', 'Los datos del perfil se han actualizado correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() } // Navegar de vuelta cuando se presiona OK
        ]);
      } else {
        Alert.alert('Error', 'No se encontraron datos de perfil para este usuario.');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Image source={require('../images/logo_2.png')} style={styles.logoImage} />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Editar Perfil</Text>
        <TextInput
          placeholder='Nombre Completo'
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder='Correo Electrónico'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />
        <TextInput
          placeholder='Contraseña actual'
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={true}
        />
        <TextInput
          placeholder='Nueva Contraseña'
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.txtPass}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>
        <TextInput
          placeholder='Edad'
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType='numeric'
        />

        <TouchableOpacity onPress={handleUpdateProfile}>
          <LinearGradient
            colors={['#871F1F', '#837B7B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9', // Cambia el color de fondo si es necesario
  },
  halfBackground: {
    height: '50%', // Mostrar solo la mitad
    overflow: 'hidden', // Ocultar el resto de la imagen
    borderBottomLeftRadius: 30, // Borde redondeado inferior izquierdo
    borderBottomRightRadius: 30, // Borde redondeado inferior derecho
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    borderBottomLeftRadius: 30, // Borde redondeado inferior izquierdo
    borderBottomRightRadius: 30, // Borde redondeado inferior derecho
  },
  logoImage: {
    position: 'absolute',
    top: 22,
    left: 8,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente blanco
    borderRadius: 10,
    padding: 20,
    marginTop: -175, // Ajuste para alinear con la parte superior del fondo
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    color: '#333',
  },
  txtPass: {
    textAlign: 'center',
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -10,
    margin: 10,
    textDecorationLine: 'underline',
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
});

export default EditProfileScreen;
