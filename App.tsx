import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { TokenResponse } from 'expo-auth-session';
import { basicAlert } from './components/alert';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard'
import { dashboardInterface } from './components/interfaces';
import Create from './pages/Create';
import Info from './pages/Info'
import Collection from './pages/Collection';

const Stack = createStackNavigator();

export default function App() {

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name='Welcome' component={Welcome} options={screenOptions.welcome}/>
          <Stack.Screen name='Dashboard' component={Dashboard} options={screenOptions.dashboard}/>
          <Stack.Screen name='Create' component={Create} options={screenOptions.create}/>
          <Stack.Screen name='Info' component={Info} options={screenOptions.info} initialParams={{
            Data: {
              MORNING: 1,
              EVENING: 2,
            },
            URI: "https://static.spacecrafted.com/ecb84ffc05884cf7aabf40ca5697efae/i/b8e3e562df5f4b6bb2049d1ecf281dc1/1/GCuCv726gZycFxatXh9yJ4/Immunizations%20copy.jpg"
          }}/>
          <Stack.Screen name='Collection' component={Collection} options={screenOptions.collection}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const screenOptions = {
  welcome: {
    headerShown: false
  },
  dashboard: {
    headerShown: false,
  },
  create: {
    headerShown: false,
  },
  info: {
    headerShown: true,
    title: "Provide more info"
  },
  collection: {
    headerShown: true,
    title: "My collection",
  }
}
