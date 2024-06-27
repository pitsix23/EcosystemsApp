import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function UploadNoticeScreen() {
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
  },
});

export default UploadNoticeScreen;

