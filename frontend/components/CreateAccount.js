import React, { useState } from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,TextInput,TouchableOpacity, Button, Image} from 'react-native';
import {Colors,DebugInstructions,Header,LearnMoreLinks,ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import SignIn from './SignIn';

const CreateAccount = () => {
    const navigation = useNavigation();
    const handleCreateAccount = () => {}
    const [state,setState] = useState({
        email: '',
        password: '',
    })

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder='Email'
                    onChangeText={text => setState({email:text})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={text => setState({password:text})}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCreateAccount} style={styles.continueBtn}>
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.signInContainer}>
                <Text style={styles.questionText}>Already have an account?</Text>
                <TouchableOpacity onPress={()=> navigation.navigate('SignIn')}>
                    <Text style={styles.signInText}> Sign In!</Text>
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

export default CreateAccount;