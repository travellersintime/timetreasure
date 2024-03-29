import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import {
    SafeAreaView
  } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import Footer from './Footer';
import { Dimensions } from 'react-native';
import { useActiveRoute } from './ActiveRouteContext';

import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";

interface Props {
    navigation: any;
}

const screenHeight = Dimensions.get('window').height;
const win = Dimensions.get('window');

const SingleMessage = (props: Props) => {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const { activeRoute, setActiveRoute } = useActiveRoute();

    const fetchMessage = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const authorizationHeader = 'Bearer ' + token;

            const response = 
                await axios.get (
                    "http://" + String("Timetreasure-tomcat-env.eba-mm9rdhjj.eu-north-1.elasticbeanstalk.com") + ":" + String("80") + "/messages/id/" + activeRoute.params.messageId, 
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
                setActiveRoute("MessageFeed", {});
            }
        } catch (error) {
            if (error.response == undefined || error.response == "" || error.response.data === "") {
                alert("Unknown error. It might be from the server. Please try again later.");
            }
            else {
                alert(error.response.data);
            }  
            
            props.navigation.navigate('MessageFeed');
            setActiveRoute("MessageFeed", {});
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
                                    {
                                        loading ? (
                                            <Text>Loading...</Text>
                                        ) : (message.messageType === "text" ? (
                                            <Text style={styles.messageContent}>{message.content}</Text>
                                        ) : (
                                            <View>
                                            <Image
                                                style={styles.image}
                                                resizeMode={'contain'}
                                                source={{uri: "https://timetreasure.s3.eu-central-1.amazonaws.com/" + message.objectKey}}
                                                />                                            
                                            </View>
                                        ))
                                    }
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
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: win.width/1.21,
        height: win.height/2,
    },

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