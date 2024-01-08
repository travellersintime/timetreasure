import React, { useState } from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus'
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    navigation: any;
}

const CreateTextMessage = (props: Props) => {
    const navigation = useNavigation();
    const [messageType, setMessageType] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messageDate, setMessageDate] = useState('');
    const [contentHeight, setContentHeight] = useState(0);

    const handleTypeChange = (type) => {
        setMessageType(type);
    };

    const handleContentSizeChange = (event) => {
        setContentHeight(event.nativeEvent.contentSize.height);
    };

    const handleSendMessage = async () => {
        try {
            const response = await axios.post("http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/messages/send", {
                type: messageType,
                title: messageTitle,
                content: messageContent,
                date: messageDate
            });
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create a text message</Text>
                    <TouchableOpacity style={styles.sendButton}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.messageTypeContainer}>
                    <TouchableOpacity onPress={() => handleTypeChange('private')} style={[styles.messageTypeButton, messageType === 'private' && styles.selectedType]}>
                        <Text>Private</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTypeChange('public')} style={[styles.messageTypeButton, messageType === 'public' && styles.selectedType]}>
                        <Text>Public</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputTitle}>
                    <TextInput
                        style={styles.inputText}
                        placeholder='Choose a title for your message'
                        onChangeText={text => setMessageTitle(text)}
                    />
                </View>
                <View style={[styles.inputView, { height: Math.max(100, contentHeight + 20) }]}>
                    <TextInput
                        style={[styles.inputText, styles.messageContentInput]}
                        placeholder='Write your message here'
                        onChangeText={text => setMessageContent(text)}
                        multiline
                        onContentSizeChange={handleContentSizeChange}
                    />
                </View>
                <View style={styles.calendarContainer}>
                    <Text style={styles.calendarText}>When should the message be unlocked?</Text>
                    <Calendar
                        onDayPress={(day) => handleDateChange(day)}
                        markedDates={{
                            [messageDate]: { selected: true, selectedColor: '#fb5b5a' }
                        }}
                    />
                </View>
            </ScrollView>
            
            <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => props.navigation.navigate('MyProfile')}>
                    <FontAwesomeIcon icon={faUser} size="30"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => props.navigation.navigate('MessageFeed')}>
                    <FontAwesomeIcon icon={faHouse} size="30"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtn} onPress={() => props.navigation.navigate('MessageFeed')}>
                    <FontAwesomeIcon icon={faCirclePlus} size="30"/>
                </TouchableOpacity>
            </View>
            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 40
    },
    title: {
        fontWeight: "bold",
        fontSize:25,
        color:"#fb5b5a",
        marginBottom: 20,
    },
    sendButton: {
        paddingVertical: 10
    },
    messageTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    messageTypeButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 5,
    },
    selectedType: {
        backgroundColor: '#fb5b5a',
    },
    inputView: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 10,
        padding: 20,
        minHeight: 100
    },
    inputText: {
        flex: 1,
        color: 'black',
    },
    inputTitle: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        marginVertical: 10,
        padding: 20,
        minHeight: 60
    },
    messageContentInput: {
        minHeight: 150,
    },
    calendarContainer: {
        marginTop: 20,
    },
    calendarText: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    calendarInput: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        padding: 15,
        height: 60,
    },
    bottomBtn: {
        padding: 20,
    },
});


export default CreateTextMessage;