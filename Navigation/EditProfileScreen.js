import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Image source={require('../images/logo_2.png')} style={styles.logoImage} />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

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
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default EditProfileScreen;

