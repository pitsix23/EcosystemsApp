import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function DetalleNoticiaScreen({ route }) {
  const { noticia } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
          </View>
        </ImageBackground>
      </View>
      <View style={[styles.formContainer, { height: windowHeight * 0.7 }]}>
        <Text style={styles.text}>{noticia.texto}</Text>
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 10,
    marginTop: 10,
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'center',
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
  logoImage: {
    position: 'absolute',
    top: 22,
    right: 8,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    textAlign: 'justify',
    paddingHorizontal: 20,
  },
});

export default DetalleNoticiaScreen;