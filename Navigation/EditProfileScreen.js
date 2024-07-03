import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, get } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, storage } from '../accesoFirebase';
import UserContext from './UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { userEmail } = useContext(UserContext); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null); 
  const [profileImageUrl, setProfileImageUrl] = useState(null); 
  const [birthdateString, setBirthdateString] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const colRef = collection(db, 'accounts');
        const q = query(colRef, where('correo', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setName(userData.nombre);
          setEmail(userData.correo);
          if (userData.fechaNacimiento !== undefined) {
            const birthdate = new Date(userData.fechaNacimiento);
            setBirthdate(birthdate);
            setBirthdateString(birthdate.toISOString().split('T')[0]);
          }
          const db = getDatabase();
          const profileRef = dbRef(db, `profile/${userEmail.replace('.', '_')}`);
          const snapshot = await get(profileRef);
          if (snapshot.exists()) {
            setProfileImageUrl(snapshot.val().imageUrl);
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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería de imágenes.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageReference = storageRef(storage, `profileImages/${userEmail}`);
      await uploadBytes(storageReference, blob);
      const downloadURL = await getDownloadURL(storageReference);
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
      throw error;
    }
  };

  const handleUpdateProfile = async () => {
    try {
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
        const updatedData = {
          nombre: name,
          correo: email,
          fechaNacimiento: birthdate.toISOString().split('T')[0],
        };

        if (password.trim() !== '') {
          updatedData.contraseña = password;
          updatedData.confirmContraseña = password;
        }

        await updateDoc(docRef, updatedData);

        if (profileImage) {
          const imageUrl = await uploadImage(profileImage);
          const db = getDatabase();
          await set(dbRef(db, `profile/${userEmail.replace('.', '_')}`), {
            imageUrl: imageUrl,
          });
          setProfileImageUrl(imageUrl);
        }

        Alert.alert('Perfil actualizado', 'Los datos del perfil se han actualizado correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'No se encontraron datos de perfil para este usuario.');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
    setBirthdateString(currentDate.toISOString().split('T')[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <TouchableOpacity onPress={pickImage} style={styles.touchable}>
              <Image source={require('../images/add-photo.png')} style={styles.icon} />
              {profileImageUrl && <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />}
            </TouchableOpacity>
          </View>
          <Image source={require('../images/logo_2.png')} style={styles.logoImage} />
        </ImageBackground>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.inputContainer}>
        <Image source={require('../images/user.png')} style={styles.ficon} />
          <TextInput
            placeholder='Nombre Completo'
            style={styles.txtInput}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
        <Image source={require('../images/mail.png')} style={styles.ficon} />
          <Text style={styles.eInput}>
            {email}
          </Text>
        </View>
        <View style={styles.inputContainer}>
        <Image source={require('../images/key (1).png')} style={styles.ficon} />
          <TextInput
            placeholder='Contraseña actual'
            style={styles.txtInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputContainer}>
        <Image source={require('../images/key.png')} style={styles.ficon} />
          <TextInput
            placeholder='Nueva Contraseña'
            style={styles.txtInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.txtPass}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Image source={require('../images/birthday.png')} style={styles.ficon} />
            <TextInput
              placeholder='Fecha de Nacimiento'
              style={styles.txtInput}
              value={birthdateString}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date(2024, 11, 31)}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>

        <TouchableOpacity onPress={handleUpdateProfile}>
          <LinearGradient
            colors={['#00C164', '#005B58']}
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
  logoImage: {
    position: 'absolute',
    top: 22,
    right: 112,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  txtInput: {
    width: '100%',
    height: 50,
    borderRadius: 30,
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
  eInput: {
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
  txtPass: {
    textAlign: 'center',
    color: 'green',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 0,
    textDecorationLine: 'underline',
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
  overlay: {
    position: 'absolute',
    top: 75,
    right: 5,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: '#000', 
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 0,
    position: 'absolute',
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

export default EditProfileScreen;
