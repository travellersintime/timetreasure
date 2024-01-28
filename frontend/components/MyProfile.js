import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
    SafeAreaView
  } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { isExpired, convertToDaysHoursMinutesFormat } from '../helpers/DateFunctions';
import Footer from './Footer';
import { Dimensions } from 'react-native';
import { useActiveRoute } from './ActiveRouteContext';

import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    navigation: any;
}

const screenHeight = Dimensions.get('window').height;

const MyProfile = (props: Props) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { activeRoute, setActiveRoute } = useActiveRoute();
    const date = new Date();

    const handleDeleteMessage = async (messageId) => {
        const token = await AsyncStorage.getItem("token");

        const authorizationHeader = 'Bearer ' + token;

        try {
            const response = 
                await axios.delete (
                    "http://" + String("Timetreasure-tomcat-env.eba-mm9rdhjj.eu-north-1.elasticbeanstalk.com") + ":" + String("80") + "/messages/delete/" + messageId, 
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
                fetchMessages();
            }
        }
        catch (error) {
            if (error.response == undefined || error.response == "" || error.response.data === "") {
                alert("Unknown error. It might be from the server. Please try again later.");
            }
            else {
                alert(error.response.data);
            }          
        }
    }

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const username = await AsyncStorage.getItem("username");

            const authorizationHeader = 'Bearer ' + token;

            const response = 
                await axios.get (
                    "http://" + String("Timetreasure-tomcat-env.eba-mm9rdhjj.eu-north-1.elasticbeanstalk.com") + ":" + String("80") + "/messages/recipient/" + username, 
                    {
                        headers: {
                            'Authorization': authorizationHeader, 
                            'Content-type': 'application/x-www-form-urlencoded', 
                            'Accept': 'Application/json',
                        },
                        data:undefined
                    }
                )
            
            if (response.status != 200) {
                props.navigation.navigate('SignIn');
            }

            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response == undefined || error.response == "" || error.response.data === "") {
                alert("Unknown error. It might be from the server. Please try again later.");
            }
            else {
                alert(error.response.data);
            }         
        }
      };

      const handleMessageClick = (id) => {
        setActiveRoute("SingleMessage", {messageId: id});
      }

      useEffect(() => {
        fetchMessages();
      }, []);

    if (loading == true) {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={{flex: .95}}>
                    <Text style = {styles.title}>My Profile</Text>
                    <Text>Loading...</Text>
                </View>
                <Footer />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{flex: .95}}>
                <Text style = {styles.title}>My Profile</Text>
                <ScrollView style={styles.scrollView} >
                    {messages.length == 0 ? <Text>No private messages sent to you.</Text> : (messages.map((message, index) => (
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
                            <View style={styles.containerRow}>
                                <TouchableOpacity style={styles.controlTouchableOpacity} onPress={() => handleMessageClick(message.id)}>
                                    <Text style={styles.controlText}>Open</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.controlTouchableOpacity} onPress={() => handleDeleteMessage(message.id)}>
                                    <Text style={styles.controlText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )))}
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
});

export default MyProfile;