import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddData from './src/index';
import Voice from './src/voice';
import Map from './src/Map';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AddData"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', 
        }}
      >
        <Stack.Screen name="AddData" component={AddData} />
        <Stack.Screen name="Voice" component={Voice} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
