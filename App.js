// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PickUp from './src/component/PickUp';
import Dashboard from './src/component/Dashboard';
import DropOut from './src/component/DropOut';
import CarSelect from './src/component/CarSelect';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PickUp" component={PickUp} />
        <Stack.Screen name="DropOut" component={DropOut} />
        <Stack.Screen name="CarSelect" component={CarSelect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
