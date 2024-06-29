import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UploadNoticeScreen from './UploadNoticeScreen';
import UploadImgScreen from './UploadImgScreen';
import EditProfileScreen from './EditProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { getAllImages } from '../firebaseStorage';

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
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const urls = await getAllImages();
      setImageUrls(urls);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Ensure refreshing indicator is turned off
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Show the refresh indicator
    fetchImages(); // Fetch images again
  }, []);

  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 1,
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
  },
});

export default TabNavigator;
