import React, { useState, useEffect } from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { Calendar } from 'react-native-calendars';
import Footer from './Footer';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
    navigation: any;
}

const CreateTextMessage = (props: Props) => {
    const navigation = useNavigation();
    const [messageType, setMessageType] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messageDate, setMessageDate] = useState(new Date());
    const [contentHeight, setContentHeight] = useState(0);
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);


    const handleTypeChange = (type) => {
        setMessageType(type);
    };

    const handleContentSizeChange = (event) => {
        setContentHeight(event.nativeEvent.contentSize.height);
    };

    const handleShowDate = () => {
        setShowDate(true);
    }

    
    const handleShowTime = () => {
        setShowTime(true);
    }

    const handleSendMessage = async () => {
        try {
            const response = await axios.post("http://" + BACKEND_ADDRESS + ":" + BACKEND_PORT + "/messages/send", {
                type: messageType,
                title: messageTitle,
                content: messageContent,
                date: messageDate
            });
        } catch (error) {
            console.log(error)
            alert(error.response.data);
        }
    };

    const onChange = (e, selectedDate) => {
        setShowDate(false);
        setShowTime(false); 
        setMessageDate(selectedDate);
    }

    useEffect(() => {
        setMessageType("private");
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create a text message</Text>
                    <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage()}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.messageTypeContainer}>
                    <TouchableOpacity onPress={() => handleTypeChange('private')} style={[styles.messageTypeButton, styles.messageTypeButtonLeft, messageType === 'private' && styles.selectedType]}>
                        <Text>Private</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTypeChange('public')} style={[styles.messageTypeButton, styles.messageTypeButtonRight, messageType === 'public' && styles.selectedType]}>
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
                        style={styles.inputText}
                        placeholder='Write your message here'
                        onChangeText={text => setMessageContent(text)}
                        multiline
                        onContentSizeChange={handleContentSizeChange}
                    />
                </View>
                <View style={styles.calendarContainer}>
                    <Text style={styles.calendarText}>When should the message be unlocked?</Text>
                    <View>
                        <TouchableOpacity onPress={() => handleShowDate()}>
                            <Text>{messageDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShowTime()}>
                            <Text>{messageDate.toLocaleTimeString()}</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        showDate && (
                            <DateTimePicker
                                value = {messageDate}
                                mode = {"date"}
                                is24Hour = {true}
                                onChange = {onChange}
                            />
                        )
                    }

                    {
                        showTime && (
                            <DateTimePicker
                                value = {messageDate}
                                mode = {"time"}
                                is24Hour = {true}
                                onChange = {onChange}
                            />
                        )
                    }
                </View>
            </ScrollView>
            
            <Footer />
            
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
        marginBottom: 0,
    },
    sendButton: {
        paddingVertical: 10
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 3
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
    },
    messageTypeButtonLeft: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    messageTypeButtonRight: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
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