import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import UploadNoticeScreen from './UploadNoticeScreen';
import UploadImgScreen from './UploadImgScreen';
import EditProfileScreen from './EditProfileScreen';
import DetalleNoticiaScreen from './DetalleNoticiaScreen';
import DetalleImagenScreen from './DetalleImagenScreen';
import { ref, onValue } from 'firebase/database';
import { database } from '../accesoFirebase'; 
import UserContext from './UserContext';

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
        headerTransparent: true,
        headerTintColor: '#000',
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: '' }} />
      <Stack.Screen name="DetalleImagen" component={DetalleImagenScreen} options={{ title: '' }} />
      <Stack.Screen name="DetalleNoticia" component={DetalleNoticiaScreen} options={{ title: '' }} />

    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const { userEmail } = useContext(UserContext);
  console.log('User Email:', userEmail);
  const [dataToShow, setDataToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    const noticiasRef = ref(database, 'noticias');
    const imagesRef = ref(database, 'images');

    Promise.all([
      new Promise((resolve, reject) => {
        onValue(noticiasRef, (snapshot) => {
          const noticiasData = snapshot.val() || [];
          const noticiasArray = Object.values(noticiasData).map(noticia => ({ ...noticia, type: 'noticia' }));
          resolve(noticiasArray);
        }, (error) => {
          console.error('Error fetching noticias:', error);
          reject(error);
        });
      }),
      new Promise((resolve, reject) => {
        onValue(imagesRef, (snapshot) => {
          const imagesData = snapshot.val() || [];
          const imagesArray = Object.keys(imagesData).map(key => ({
            ...imagesData[key],
            key,
            type: 'image'
          }));
          resolve(imagesArray);
        }, (error) => {
          console.error('Error fetching images:', error);
          reject(error);
        });
      })
    ]).then(([noticiasArray, imagesArray]) => {
      const combinedArray = [...imagesArray, ...noticiasArray];
      combinedArray.sort((a, b) => b.timestamp - a.timestamp); 
      
      setDataToShow(combinedArray);
      setLoading(false);
      setRefreshing(false);
    }).catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleImagen', { image: item })} style={styles.imageItem}>
          <Image source={{ uri: item.url }} style={styles.image} />
          {item.description && (
            <Text style={styles.imageDescription}>{item.description}</Text>
          )}
        </TouchableOpacity>
      );
    } else if (item.type === 'noticia') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DetalleNoticia', { noticia: item })} style={styles.noticiaItem}>
          <Text style={styles.noticiaText}>{item.texto}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

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
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userEmail })} style={styles.settingsButton}>
        <MaterialCommunityIcons name="cog" size={30} color="white" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>Inicio</Text>
      </View>
      <FlatList
        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    height: Dimensions.get('window').height * 0.1,
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 37,
    right: 20,
  },
  flatListContent: {
    paddingBottom: 80,
  },
  imageItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 4,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  noticiaItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 4,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
  },
  imageDescription: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  noticiaText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'justify',
  },
  flatList: {
    flex: 1,
    marginLeft: 5,
  },
});

export default TabNavigator;
