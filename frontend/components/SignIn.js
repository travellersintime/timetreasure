import React, { useState } from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,TextInput,TouchableOpacity, Button, Image} from 'react-native';
import {Colors,DebugInstructions,Header,LearnMoreLinks,ReloadInstructions} from 'react-native/Libraries/NewAppScreen';

const SignIn = () => {
    const handleSignIn = () => {};
    const handleForgotPassword = () => {}
    const handleCreateAccount = () => {}
    const [state,setState] = useState({
        email: '',
        password: '',
    })

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
                    onChangeText={text => setState({email:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    tyle={styles.inputText}
                    secureTextEntry
                    placeholder="Password"
                    onChangeText={text => setState({password:text})}/>
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
                <TouchableOpacity onPress={handleCreateAccount} style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title:{
        fontWeight: "bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom: 40,
    },
    inputView:{
        backgroundColor:"white",
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 10,
        padding: 20,
        height: 60
    },
    inputText:{
        flex: 1,
        color:"black"
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
        color: 'white'
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
        marginBottom: 70
    },
    logo: {
        width: 400,
        height: 200,
        resizeMode: 'contain'
    }

});

export default SignIn;