import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Image source={require('../images/logo_1.png')} style={styles.splashImage} />
      <Text style={styles.splashText}>Bienvenido...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C1BB',
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  splashText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
});

export default SplashScreen;
