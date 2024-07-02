import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDatabase, ref, push, set } from 'firebase/database'; 
import { app } from '../accesoFirebase'; 

function UploadNoticeScreen({ navigation }) {
  const [textoNoticia, setTextoNoticia] = useState('');

  const guardarTexto = async () => {
    const db = getDatabase(app);
    const textRef = ref(db, 'noticias'); 

    try {
      const nuevaNoticiaRef = push(textRef); 
      await set(nuevaNoticiaRef, { 
        texto: textoNoticia,
        timestamp: Date.now() 
      }); 
      console.log('Noticia guardada correctamente en Realtime Database.');
      setTextoNoticia(''); 
      
    } catch (error) {
      console.error('Error al guardar la noticia en Realtime Database:', error);
    }
  };

  const handleGuardarNoticia = async () => {
    try {
      await guardarTexto();
      console.log('Noticia guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la noticia:', error);
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
          <LinearGradient
            colors={['#00C164', '#005B58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnLogin}
          >
            <Text style={styles.txtLogin}>Guardar noticia</Text>
          </LinearGradient>
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
});

export default UploadNoticeScreen;
