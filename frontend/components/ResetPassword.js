import React, { useState } from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Props {
    navigation: any;
}

const ResetPassword = (props: Props) => {
    const navigation = useNavigation();

    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');

    const handleUpdatePassword = async () => {
        try {
            const response = await axios.post("http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/auth/resetPassword", {code: verificationCode, newPassword: password});
  
            if (response.status == 200) {
              alert("Password has been successfully updated.");
              props.navigation.navigate('SignIn');
            }
          } catch (error) {
            console.log(error)
              if (error.response.data == "") {
                  alert("Unknown error. It might be from the server. Please try again later.");
              }
              else {
                  alert(error.response.data);
              }
          }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder='Verification code'
                    onChangeText= {text => setVerificationCode(text)}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder='New Password'
                    onChangeText={text => setPassword(text)}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleUpdatePassword()} style={styles.continueBtn}>
                    <Text style={styles.continueText}>Reset password</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.signInContainer}>
                <Text style={styles.questionText}>Want to go back to Sign In?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.signInText}> Click Here!</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    );
}

const styles=StyleSheet.create({
    container:{
        paddingVertical: 80,
        paddingHorizontal: 25,
        justifyContent: 'center',
        position: 'relative'
    },
    title:{
        fontWeight: "bold",
        fontSize: 40,
        color: "#fb5b5a",
        marginBottom: 40,
    },
    inputView:{
        backgroundColor:'white',
        borderBlockColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 10,
        padding: 20,
        height: 60
    },
    inputText: {
        flex: 1,
        color: 'black'
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    continueBtn: {
        width: '80%',
        backgroundColor: '#fb5b5a',
        borderRadius: 25,
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
        marginTop: 40
    },
    continueText: {
        color: 'white',
        fontSize: 20
    },
    signInContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    signInText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fb5b5a'

    },
    questionText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    

}) 

export default ResetPassword;