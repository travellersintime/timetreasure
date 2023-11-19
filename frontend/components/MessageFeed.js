import React, { useEffect, useState } from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,useColorScheme,View,TextInput,TouchableOpacity, Button, Image} from 'react-native';
import {Colors,DebugInstructions,Header,LearnMoreLinks,ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';

const MessageFeed = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('https://your-api-endpoint/messages');
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data); // Assuming data is an array of messages
                } else {
                    console.error('Failed to fetch messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <View style={styles.container}>
            {messages.map((message, index) => (
                <View key={index} style={styles.messageBox}>
                    <View style={styles.leftContent}>
                        <Text>{message.title}</Text>
                        <Text>{message.author}</Text>
                    </View>
                </View>

            ))}
        </View>
    )

    
}

const styles=StyleSheet.create({
        container: {

        }
    });

export default MessageFeed;