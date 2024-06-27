import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Navigation/SplashScreen';
import HomeScreen from './Navigation/HomeScreen';
import LoginScreen from './Navigation/LoginScreen';
import RegisterScreen from './Navigation/RegisterScreen';
import ResetPasswordScreen from './Navigation/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simula una carga de 3 segundos
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
            headerTransparent: true, // Hace que el encabezado sea transparente
            headerTintColor: '#D9D9D9', // Color de texto del encabezado en blanco
            headerTitleStyle: {
              fontWeight: 'bold', // Estilo del título del encabezado
            },
          }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
