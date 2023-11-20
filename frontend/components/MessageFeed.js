import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    SafeAreaView
  } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { isExpired, convertToDaysHoursMinutesFormat } from '../helpers/DateFunctions';

interface Props {
    navigation: any;
}

const MessageFeed = (props: Props) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const date = new Date();

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const authorizationHeader = 'Bearer ' + token;
            console.log(authorizationHeader);

            const response = 
                await axios.get (
                    "http://192.168.1.3:8080/messages/isPublic/true", 
                    {
                        headers: {
                            'Authorization': authorizationHeader
                        }
                    }
                )
            
            if (response.status != 200) {
                props.navigation.navigate('SignIn');
            }

            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
      };

      useEffect(() => {
        fetchMessages();
      }, []);

    if (loading == true) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Text style = {styles.title}>Public Messages</Text>
            <ScrollView style={styles.scrollView}>
                {messages.map((message, index) => (
                    <View key={index} style={styles.container}>
                        <View style={styles.containerRow}>
                            <Text style={styles.messageTitle}>{message.title}</Text>
                        </View>
                        <View style={styles.containerRow}>
                            <FontAwesomeIcon icon={faUser} style={{flex: 1, marginRight: 3}}/>
                            <Text>{message.author}</Text>
                        </View>
                        <View style={styles.containerRow}>
                            <FontAwesomeIcon icon={faClock} style={{flex: 1, marginRight: 3}}/>
                            <View>
                                { isExpired(date, message.expiresOn) == true ? <Text>0d 0h 0m</Text> : <Text>{convertToDaysHoursMinutesFormat(date, message.expiresOn)}</Text> }
                            </View>
                        </View>
                    </View>

                ))}
            </ScrollView>
        </SafeAreaView>
    )

    
}

const styles=StyleSheet.create({
        container: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#BABABA',
            borderRadius: 10,
            backgroundColor: "#EDEDED",
            padding: 10,
            marginBottom: 5,
            flexDirection: 'column',
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

        messageTitle: {
            fontWeight: "bold"
        },

        safeAreaView: {
            padding: 20
        },

        scrollView: {
            marginBottom: 50
        }
    });

export default MessageFeed;