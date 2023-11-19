import React, { useState } from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,TextInput,TouchableOpacity,} from 'react-native';
import {Colors,DebugInstructions,Header,LearnMoreLinks,ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';

import SignIn from './components/SignIn';
import CreateAccount from './components/CreateAccount'
import MessageFeed from './components/MessageFeed';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App =  () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MessageFeed'>
        <Stack.Screen name='SignIn' component={SignIn}/>
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingBottom: '5',
        position: 'relative'
  },
});

export default App;
