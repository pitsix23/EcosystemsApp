import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadNoticeScreen from './UploadNoticeScreen';
import UploadImgScreen from './UploadImgScreen';
import EditProfileScreen from './EditProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { getAllImages } from '../firebaseStorage'; // Asegúrate de importar correctamente
import { database } from '../accesoFirebase'; // Asegúrate de importar correctamente
import { ref, onValue } from 'firebase/database';

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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener noticias usando Firebase Realtime Database
  useEffect(() => {
    const noticiasRef = ref(database, 'noticias');
    onValue(noticiasRef, (snapshot) => {
      const noticiasData = snapshot.val() || [];
      setNoticias(Object.values(noticiasData)); // Convertir objeto de noticias en array
      setLoadingNoticias(false);
      setRefreshing(false);
      console.log('Noticias Data:', noticiasData); // Verificar las noticias leídas desde Firebase
    }, (error) => {
      console.error('Error fetching noticias:', error);
      setLoadingNoticias(false);
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    fetchData(); // Cargar imágenes y noticias al inicio
  }, []);

  useEffect(() => {
    // Actualizar imágenes y noticias cuando refreshing cambia
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);

  const fetchData = async () => {
    try {
      const urls = await getAllImages(); // Obtener URLs de imágenes desde Firebase Storage
      setImages(urls); // Actualizar estado de imágenes
      setLoadingImages(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoadingImages(false);
    }

    try {
      // Actualizar estado de noticias usando Firebase Realtime Database
      const noticiasRef = ref(database, 'noticias');
      onValue(noticiasRef, (snapshot) => {
        const noticiasData = snapshot.val() || [];
        setNoticias(Object.values(noticiasData)); // Convertir objeto de noticias en array
        setLoadingNoticias(false);
        setRefreshing(false);
        console.log('Noticias Data:', noticiasData); // Verificar las noticias leídas desde Firebase
      }, (error) => {
        console.error('Error fetching noticias:', error);
        setLoadingNoticias(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Error fetching noticias:', error);
      setLoadingNoticias(false);
      setRefreshing(false);
    } finally {
      setRefreshing(false); // Desactivar indicador de actualización
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Activar indicador de actualización
  }, []);

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleImagen', { image: item })}>
          <Image source={{ uri: item.uri }} style={styles.item} />
        </TouchableOpacity>
      );
    } else if (item.type === 'noticia') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleNoticia', { noticia: item })}>
          <View style={styles.item}>
            <Text style={styles.noticiaText}>{item.texto}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (loadingImages || loadingNoticias) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const dataToShow = [
    ...images.map(image => ({ type: 'image', uri: image })), // Asegurarse de que el campo `uri` coincida con las URLs válidas
    ...noticias.map(noticia => ({ type: 'noticia', ...noticia })),
  ];

  if (dataToShow.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No hay imágenes ni noticias disponibles.</Text>
      </View>
    );
  }

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
      <FlatList
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Mostrar en 2 columnas
        contentContainerStyle={styles.flatListContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.flatList}
      />
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
  logoImage: {
    position: 'absolute',
    top: 22,
    left: 8,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: -15,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    top: -20,
  },
  flatListContent: {
    paddingBottom: 80, // Ajustar según sea necesario
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 2 - 15, // Ajustar ancho del elemento según tamaño de la pantalla
    height: Dimensions.get('window').width / 2 - 15, // Ajustar alto del elemento según tamaño de la pantalla
  },
  noticiaText: {
    fontSize: 16,
    textAlign: 'justify',
    paddingHorizontal: 10,
  },
  flatList: {
    flex: 1,
  },
});

export default TabNavigator;
