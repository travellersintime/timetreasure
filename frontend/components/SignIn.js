import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";

interface Props {
    navigation: any;
}

const SignIn = (props: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
          const response = await axios.post("http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/auth/login", {username, password})
          console.log(username);
          await AsyncStorage.setItem('token', response.data.token);
          await AsyncStorage.setItem('username', username);
          props.navigation.navigate('MessageFeed');
        } catch (error) {
            alert(error.data);
        }
      };

      const handleForgotPassword = () => {};

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require ('../assets/logo.png')} style={styles.logo}/>
            </View>
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.inputView}>
                <TextInput 
                    style={styles.inputText}
                    placeholder="Email"
                    onChangeText={text => setUsername(text)}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSignIn} style={styles.loginBtn}>
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleForgotPassword} style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('CreateAccount')} style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        position: 'relative'
    },
    title:{
        fontWeight: "bold",
        fontSize:40,
        color:"#fb5b5a",
        marginBottom: 40,
    },
    inputView:{
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 10,
        padding: 20,
        height: 60
    },
    inputText:{
        flex: 1,
        color:'black'
    },
    forgotAndSignUpText:{
        color:"white",
        fontSize:11
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    buttonContainer: {
        alignItems: 'center', // Center content horizontally
        marginTop: 10,
    },
    signInText: {
        color: 'white',
        fontSize: 20
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '1000'
    },
    bottomBtn: {
        paddingVertical: 30,
    },
    bottomBtnText: {
        fontSize: 15
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 5
    },
    logo: {
        width: win.width/1.25,
        paddingTop: 200,
        resizeMode: 'contain'
    }

});

export default SignIn;