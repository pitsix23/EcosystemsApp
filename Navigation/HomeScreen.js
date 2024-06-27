import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UploadNoticeScreen from './UploadNoticeScreen';
import UploadImgScreen from './UploadImgScreen';
import EditProfileScreen from './EditProfileScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LogoutScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return null;
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#00C1BB',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false, // Ocultar la barra superior para esta pantalla
        }}
      />
      <Tab.Screen
        name="UploadNotice"
        component={UploadNoticeScreen}
        options={{
          tabBarLabel: 'Subir Noticia',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={size} />
          ),
          headerShown: false, // Ocultar la barra superior para esta pantalla
        }}
      />
      <Tab.Screen
        name="UploadImg"
        component={UploadImgScreen}
        options={{
          tabBarLabel: 'Subir Imagen',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="image" color={color} size={size} />
          ),
          headerShown: false, // Ocultar la barra superior para esta pantalla
        }}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'Cerrar Sesión',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          ),
          headerShown: false, // Ocultar la barra superior para esta pantalla
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Asegurarse de que la barra superior esté oculta
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation(); // Obtener la navegación desde el contexto

  return (
    <View style={styles.container}>
      <View style={styles.halfBackground}>
        <ImageBackground source={require('../images/img_fondo.png')} style={styles.backgroundImage} imageStyle={styles.imageStyle}>
          <View style={styles.overlay}>
            <Image source={require('../images/logo_2.png')} style={styles.logoImage} />
          </View>
        </ImageBackground>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.headerButtonContainer}>
        <MaterialCommunityIcons name="cog" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>Inicio</Text>
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
  headerButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  logoImage: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    position: 'absolute',
    left: 150,
    top: 35,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default TabNavigator;
