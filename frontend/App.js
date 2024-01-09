import React, { useState } from 'react';
import SignIn from './components/SignIn';
import CreateAccount from './components/CreateAccount'
import MessageFeed from './components/MessageFeed';
import SingleMessage from './components/SingleMessage';
import CreateTextMessage from './components/CreateTextMessage';
import MyProfile from './components/MyProfile'
import ResetPassword from './components/ResetPassword'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';


const Stack = createStackNavigator();

const App =  () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn' screenOptions={{headerShown: false}}>
        <Stack.Screen name='SignIn' component={SignIn} options={{animationEnabled: false}}/>
        <Stack.Screen name='CreateAccount' component={CreateAccount} options={{animationEnabled: false}}/>
        <Stack.Screen name='MessageFeed' component={MessageFeed} options={{animationEnabled: false}}/>
        <Stack.Screen name='SingleMessage' component={SingleMessage} options={{animationEnabled: false}}/>
        <Stack.Screen name='CreateTextMessage' component={CreateTextMessage} options={{animationEnabled: false}}/>
        <Stack.Screen name='MyProfile' component={MyProfile} options={{animationEnabled: false}}/>
        <Stack.Screen name='ResetPassword' component={ResetPassword} options={{animationEnabled: false}}/>
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
