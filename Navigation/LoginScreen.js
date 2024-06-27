import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Image source={require('../images/logo_2.png')} style={styles.topRightImage} />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.txtSubtitulo}>Ingresar con tu cuenta</Text>
        <TextInput placeholder='multimedios@gmail.com' style={styles.txtInput}></TextInput>
        <TextInput placeholder='contraseña' secureTextEntry={true} style={styles.txtInput}></TextInput>

        <TouchableOpacity>
          <Text style={styles.txtPass} onPress={() => navigation.navigate('ResetPassword')}>¿Has olvidado su contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <LinearGradient
            colors={['green', '#005B58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.btnLogin}
          >
            <Text style={styles.txtLogin} onPress={() => navigation.navigate('Home')}>Iniciar sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.txtCuenta}>No tiene cuenta?</Text>
        <TouchableOpacity>
          <Text style={styles.txtRegistrarse} onPress={() => navigation.navigate('Register')}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
  topRightImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    marginTop: -155,
  },
  txtSubtitulo: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'left',
    paddingLeft: 30,
    marginTop: 20,
  },
  txtInput: {
    width: '85%',
    height: 50,
    borderRadius: 30,
    paddingLeft: 30,
    marginTop: 20,
    marginLeft: 20,
    borderColor: 'gray',
    color: '#000000',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 4,
    shadowRadius: 10,
    elevation: 10,
  },
  txtPass: {
    textAlign: 'right',
    paddingTop: 10,
    marginRight: 50,
    color: '#00C1BB',
    fontSize: 15,
  },
  btnLogin: {
    borderRadius: 30,
    width: 219,
    height: 53,
    marginTop: 35,
    marginLeft: 60,
    paddingTop: 10,
  },
  txtLogin: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  txtCuenta: {
    textAlign: 'center',
    paddingTop: 10,
    color: '#00C1BB',
    fontSize: 15,
    alignItems: 'center',
  },
  txtRegistrarse: {
    textAlign: 'center',
    color: '#00C1BB',
    fontSize: 15,
    alignItems: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
