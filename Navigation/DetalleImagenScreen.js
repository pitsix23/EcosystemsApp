import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';

function DetalleImagenScreen({ route }) {
  const { image } = route.params;

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
        <Image source={{ uri: image.url }} style={styles.image} />
        <Text style={styles.description}>{image.description}</Text>
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
  headerButtonContainer: {
    position: 'absolute',
    top: 37,
    right: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 10,
    marginTop:10,
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    position: 'absolute',
    top: 22,
    right: 8,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default DetalleImagenScreen;
