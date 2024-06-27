import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Button, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../accesoFirebase'; // Importa el módulo de Firebase que configuraste

function UploadImgScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePickerAsync = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (!pickerResult.cancelled) {
        setSelectedImage(pickerResult.uri);
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
  
      console.log('Selected Image URI:', selectedImage); // Verifica la URI de la imagen seleccionada
  
      const response = await fetch(selectedImage);
      const blob = await response.blob();
  
      const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
  
      const uploadTask = storage.ref(`images/${filename}`).put(blob);
  
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            Alert.alert('Imagen subida con éxito');
            // Guarda downloadURL en tu base de datos Firebase si es necesario
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
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
        ) : (
          <Text>Selecciona una imagen</Text>
        )}
        <Button title="Seleccionar Imagen" onPress={openImagePickerAsync} />
        <Button title="Subir Imagen a Firebase" onPress={uploadImageToFirebase} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  halfBackground: {
    height: '10%', // Mostrar solo la mitad
    overflow: 'hidden', // Ocultar el resto de la imagen
    borderBottomLeftRadius: 20, // Borde redondeado inferior izquierdo
    borderBottomRightRadius: 20, // Borde redondeado inferior derecho
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    borderBottomLeftRadius: 20, // Borde redondeado inferior izquierdo
    borderBottomRightRadius: 20, // Borde redondeado inferior derecho
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default UploadImgScreen;
