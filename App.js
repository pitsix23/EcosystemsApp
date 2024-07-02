import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Navigation/SplashScreen';
import HomeScreen from './Navigation/HomeScreen';
import LoginScreen from './Navigation/LoginScreen';
import RegisterScreen from './Navigation/RegisterScreen';
import ResetPasswordScreen from './Navigation/ResetPasswordScreen';
import UpdtPasswordScreen from './Navigation/UpdtPasswordScreen';
import { UserProvider } from './Navigation/UserContext'; // Importar el proveedor del contexto

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
    <UserProvider> 
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
              headerTransparent: true, 
              headerTintColor: '#000', 
            }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerTitle: '' }} />
          <Stack.Screen name="UpdtPassword" component={UpdtPasswordScreen} options={{ headerTitle: '' }}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: '' }}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
