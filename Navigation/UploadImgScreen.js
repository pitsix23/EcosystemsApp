import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { database } from '../accesoFirebase'; // Importa tu configuración de Firebase Database

function UploadImgScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');

  const openImagePickerAsync = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log('Picker Result:', pickerResult);

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        setSelectedImage(asset.uri);
        setImageName(asset.fileName);
      } else {
        Alert.alert('Error', 'No se seleccionó ninguna imagen.');
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  }, []);

  const uploadImageToFirebase = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('Error', 'Por favor selecciona una imagen primero.');
        return;
      }

      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const storageRef = ref(getStorage(), `images/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          Alert.alert('Error', 'Hubo un problema al subir la imagen.');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);

            // Guardar la URL y la descripción en Firebase Database
            const imagesRef = ref(database, 'images');
            const newImageRef = push(imagesRef); // Otra forma de identificar cada imagen

            set(newImageRef, {
              url: downloadURL,
              description: description // Aquí guardamos la descripción ingresada
            });

            setSelectedImage(null); // Actualiza el estado con la nueva URL
            setDescription(''); // Limpia el campo de descripción
            Alert.alert('Imagen subida con éxito');
          });
        }
      );
    } catch (error) {
      console.error('Error en la función uploadImageToFirebase:', error);
      Alert.alert('Error', 'Hubo un problema al preparar la imagen para subir.');
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.headerButtonContainer}>
          <MaterialCommunityIcons name="cog" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>Subir Imagen</Text>
        <View style={styles.contentSelect}>
          {selectedImage ? (
            <>
              <Text style={styles.imageName}>{imageName}</Text>
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
              <TextInput
                style={styles.inputDescription}
                placeholder="Descripción de la imagen"
                onChangeText={text => setDescription(text)}
                value={description}
              />
              <Button title="Subir Imagen a Firebase" onPress={uploadImageToFirebase} />
            </>
          ) : (
            <Button title="Seleccionar Imagen" onPress={openImagePickerAsync} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  halfBackground: {
    height: '10%',
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerButtonContainer: {
    position: 'absolute',
    top: -38,
    right: 20,
  },
  logoImage: {
    position: 'absolute',
    top: 22,
    left: 8,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    position: 'absolute',
    top: -55,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentSelect: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageName: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
  inputDescription: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default UploadImgScreen;
