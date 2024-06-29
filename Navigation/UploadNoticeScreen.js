import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, push, set } from 'firebase/database'; // Importa las funciones necesarias de Firebase Database
import { app } from '../accesoFirebase'; // Ajusta la ruta según sea necesario

function UploadNoticeScreen({ navigation }) {
  const [textoNoticia, setTextoNoticia] = useState('');

  const guardarTexto = async () => {
    const db = getDatabase(app);
    const textRef = ref(db, 'noticias'); // Nodo donde guardarás las noticias, ajusta según tu estructura

    try {
      const nuevaNoticiaRef = push(textRef); // Genera una nueva clave única para la noticia
      await set(nuevaNoticiaRef, { texto: textoNoticia }); // Guarda el texto bajo la nueva clave
      console.log('Noticia guardada correctamente en Realtime Database.');
      setTextoNoticia(''); // Reinicia el estado del textoNoticia a una cadena vacía
      // Puedes añadir aquí la navegación o cualquier otra lógica de éxito
    } catch (error) {
      console.error('Error al guardar la noticia en Realtime Database:', error);
      // Manejo de errores
    }
  };

  const handleGuardarNoticia = async () => {
    try {
      await guardarTexto();
      console.log('Noticia guardada correctamente.');
      // Puedes añadir aquí la navegación o cualquier otra lógica de éxito
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
      // Manejo de errores
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
        <Text style={styles.contentText}>Subir Noticia</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la noticia..."
          onChangeText={(text) => setTextoNoticia(text)}
          value={textoNoticia}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleGuardarNoticia}>
          <Text style={styles.buttonText}>Guardar Noticia</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  contentText: {
    position: 'absolute',
    top: -55,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadNoticeScreen;