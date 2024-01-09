import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'

interface Props {
    navigation: any;
}

const SignIn = (props: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const handleSignIn = async () => {
        try {
          const response = await axios.post("http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/auth/login", {username, password})
          console.log(username);
          await AsyncStorage.setItem('token', response.data.token);
          await AsyncStorage.setItem('username', username);
          props.navigation.navigate('MessageFeed');
        } catch (error) {
            alert(error.response.data);
        }
      };

      const handleForgotPassword = () => {setShowForgotPasswordModal(true); };
      const sendVerificationCode = async () => {
        try{
            setShowForgotPasswordModal(false);
            props.navigation.navigate('ResetPassword');
        }catch (error) {
            console.error('Error sending verification code:', error);
        }
      };
      const updatePassword = async () => {};

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
            
            <Modal visible={showForgotPasswordModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setShowForgotPasswordModal(false)} style={styles.closeBtn}>
                            <FontAwesomeIcon icon={faCircleXmark}/>
                        </TouchableOpacity>
                        <View style={styles.modalText}>
                            <TextInput style={styles.rstText} placeholder="Enter your email to reset password" placeholderTextColor="gray" onChangeText={text => setEmail(text)}/>
                        </View>
                        <TouchableOpacity onPress={sendVerificationCode} style={styles.resetBtn}>
                            <Text style={{color: 'white'}}>Send Verification Code</Text>
                        </TouchableOpacity>
                        
                        {/* Error message if email doesn't exist */}
                        {/* ... */}
                    </View>
                </View>
            </Modal>
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '80%',
        padding: 20,
        borderRadius: 10,
    },
    emailText: {
        color: 'black',
        fontSize: 20,
    },
    modalText: {
        borderRadius: 10,
        borderBlockColor: 'black',
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
    rstText: {
        flex: 1,
        color:'black',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    resetBtn: {
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:40,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10,
        marginLeft: 27
    }

});

export default SignIn;