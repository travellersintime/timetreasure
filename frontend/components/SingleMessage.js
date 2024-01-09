import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    SafeAreaView
  } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import Footer from './Footer';
import { Dimensions } from 'react-native';

import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";

interface Props {
    navigation: any;
}

const screenHeight = Dimensions.get('window').height;

const SingleMessage = (props: Props) => {
    const {messageId} = props.route.params;
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessage = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const authorizationHeader = 'Bearer ' + token;
            console.log(authorizationHeader);
            console.log(messageId);

            const response = 
                await axios.get (
                    "http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/messages/id/" + messageId, 
                    {
                        headers: {
                            'Authorization': authorizationHeader, 
                            'Content-type': 'application/x-www-form-urlencoded', 
                            'Accept': 'Application/json',
                        },
                        data:undefined
                    }
                )
            
            if (response.status == 200) {
                setMessage(response.data);
                setLoading(false);
            }

            else {
                alert("There was a problem trying to get your message.");
                props.navigation.navigate('MessageFeed');
            }
        } catch (error) {
            alert(error.data);
        }
      };

      useEffect(() => {
        fetchMessage();
      }, []);

    if (loading == true) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={{flex: .95}}>
                    <Text style = {styles.title}>Message</Text>
                    <Text>Loading...</Text>
                </View>
                <Footer />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{flex: .95}}>
                <Text style = {styles.title}>Message</Text>
                <ScrollView style={styles.scrollView}>
                        <View>
                            <View style={styles.containerRow}>
                                <Text style={styles.messageTitle}>{message.title}</Text>
                            </View>
                            <View style={styles.containerRow}>
                                <FontAwesomeIcon icon={faUser} style={{flex: 1, marginRight: 3}}/>
                                <Text>{message.author}</Text>
                            </View>
                            <View>
                                <View style={styles.container}>
                                    <Text style={styles.messageContent}>{message.content}</Text>
                                </View>
                            </View>
                        </View>
                </ScrollView>
            </View>

            <Footer />
        </SafeAreaView>
    )

    
}

const styles=StyleSheet.create({
    container: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#BABABA',
            borderRadius: 0,
            padding: 10,
            marginBottom: 5,
            flexDirection: 'column',
            marginTop: 15,
            width: '100%'
    },

    containerRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 3
    },

    title:{
        fontWeight: "bold",
        fontSize:30,
        color:"#fb5b5a",
        marginBottom: 20,
    },

    safeAreaView: {
        padding: 20,
        flex: 1
    },

    scrollView: {
        marginBottom: 50,
        maxHeight: {screenHeight}
    },
    
    controlTouchableOpacity: {
        marginRight: 10
    },

    controlText: {
        fontWeight: 'bold',
        color:"#fb5b5a"
    },

    bottomBtn: {
        paddingVertical: 20,
    },

    messageTitle: {
        fontWeight: "bold",
        fontSize: 20
    },
    
    messageContent: {
        fontStyle: 'italic',
        fontSize: 15
    }
});


export default SingleMessage;