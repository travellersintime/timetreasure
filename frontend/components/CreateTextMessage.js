import React, { useState, useEffect } from 'react';
import { StyleSheet,Text,View,TextInput,TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {BACKEND_ADDRESS, BACKEND_PORT} from "@env";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveRoute } from './ActiveRouteContext';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    navigation: any;
}

const CreateTextMessage = (props: Props) => {
    const navigation = useNavigation();
    const [messageVisibility, setMessageVisibility] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [messageDate, setMessageDate] = useState(new Date());
    const [contentHeight, setContentHeight] = useState(0);
    const [messageRecipient, setMessageRecipient] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [messageType, setMessageType] = useState('');
    const { activeRoute, setActiveRoute } = useActiveRoute();
    const [photo, setPhoto] = useState(null);

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(permissionResult.granted === false) {
            alert('Camera permission is required to take a photo');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if(!result.canceled) {
            setPhoto(result.assets[0])
        }
    };
    

    const handleVisibilityChange = (visibility) => {
        setMessageVisibility(visibility);
    };

    const handleTypeChange = (type) => {
        setMessageType(type);
    };

    const handleContentSizeChange = (event) => {
        setContentHeight(event.nativeEvent.contentSize.height);
    };

    const handleShowDate = () => {
        setShowDate(true);
    };

    
    const handleShowTime = () => {
        setShowTime(true);
    };

    const handleSendMessage = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const authorizationHeader = 'Bearer ' + token;

            const username = await AsyncStorage.getItem("username");


            if (messageType === "text") {
                const response = await axios.post("http://" + String(BACKEND_ADDRESS) + ":" + String(BACKEND_PORT) + "/messages/text", {
                    title: messageTitle,
                    content: messageContent,
                    author: username,
                    recipient: messageVisibility === "public" ? "admin" : messageRecipient,
                    isPublic: messageVisibility === "private" ? "false" : "true",
                    expiresOn: new Date(messageDate.getTime() + 7200 * 1000)
                }, {
                    headers: {
                        'Authorization': authorizationHeader, 
                    }
                });
            }
            else if (messageType === "photo") {
                const formData = new FormData();
                let imageType = "";

                console.log(photo.type);
                console.log(photo.uri);

                if (String(photo.uri).endsWith("jpeg") || String(photo.uri).endsWith("jpg")) {
                    imageType = "image/jpeg";
                }
                else if (String(photo.uri).endsWith("png")) {
                    imageType = "image/png";
                }

                formData.append('file', {
                    name: "myImage.jpg",
                    type: imageType,
                    uri: photo.uri,
                });
                formData.append('title', messageTitle);
                formData.append('author', username);

                console.log(messageVisibility)
                formData.append('recipient', messageVisibility === "public" ? "admin" : messageRecipient);
                formData.append('isPublic', messageVisibility === "private" ? "false" : "true");
                const expiresOnDate = new Date(messageDate.getTime() + 7200 * 1000);
                formData.append('expiresOn', expiresOnDate.toISOString());

                const response = await axios.post("http://" + String(BACKEND_ADDRESS) + ":" + String(BACKEND_PORT) + "/messages/image", formData, {
                    headers: {
                        'Authorization': authorizationHeader,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            alert("Message sent successfully.");
            setActiveRoute("MessageFeed", {});
            navigation.navigate('MessageFeed');
        } catch (error) {
            if (error.response != undefined) {
                alert(error.response.data);
            }
            else {
                console.log(error);
                alert("Unknown error.");
            }
        }
    };

    const onChange = (e, selectedDate) => {
        setShowDate(false);
        setShowTime(false); 
        setMessageDate(selectedDate);
    }

    useEffect(() => {
        setMessageVisibility("private");
        setMessageType("photo");
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
                <View style={styles.messageVisibilityContainer}>
                    <TouchableOpacity onPress={() => handleVisibilityChange('private')} style={[styles.messageVisibilityButton, styles.messageVisibilityButtonLeft, messageVisibility === 'private' && styles.selectedVisibility]}>
                        <Text>Private</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVisibilityChange('public')} style={[styles.messageVisibilityButton, styles.messageVisibilityButtonRight, messageVisibility === 'public' && styles.selectedVisibility]}>
                        <Text>Public</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.messageTypeContainer}>
                    <TouchableOpacity onPress={() => handleTypeChange('photo')} style={[styles.messageTypeButton, styles.messageTypeButtonLeft, messageType === 'photo' && styles.selectedType]}>
                        <FontAwesomeIcon icon={faImage}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTypeChange('text')} style={[styles.messageTypeButton, styles.messageTypeButtonRight, messageType === 'text' && styles.selectedType]}>
                        <FontAwesomeIcon icon={faKeyboard}/>
                    </TouchableOpacity>
                </View>
                {
                    messageVisibility === "private" &&
                    (
                        <View style={styles.inputTitle}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Type the destination E-Mail address'
                                onChangeText={text => setMessageRecipient(text)}
                            />
                        </View>
                    )
                }
                <View style={styles.inputTitle}>
                    <TextInput
                        style={styles.inputText}
                        placeholder='Choose a title for your message'
                        onChangeText={text => setMessageTitle(text)}
                    />
                </View>
                {
                    messageType === 'text' &&
                    (
                        <View style={[styles.inputView, { height: Math.max(100, contentHeight + 20) }]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Write your message here'
                                onChangeText={text => setMessageContent(text)}
                                multiline
                                onContentSizeChange={handleContentSizeChange}
                            />
                        </View>
                    ) 
                }
                {
                    messageType === 'photo' &&
                    (
                        <View style={[{ height: Math.max(100, contentHeight + 20) }]}>
                            <TouchableOpacity onPress={openCamera} style={{ alignItems: 'center' }}>
                                    { photo ? (
                                        <Image source={{ uri: photo.uri }} style={{ width: 100, height: 100 , borderRadius: 50}} />
                                    ) : (
                                        <View style={{ width: 100, height: 100, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center', borderRadius: 50 }}>
                                            <FontAwesomeIcon icon={faCamera} size={30} color={'#fb5b5a'} />
                                        </View>
                                    )}
                            </TouchableOpacity>
                        </View>
                    )
                }
                <View style={styles.calendarContainer}>
                    <Text style={styles.calendarText}>When should the message be unlocked?</Text>
                    
                    <View>
                        <TouchableOpacity onPress={() => handleShowDate()} style={[styles.messageVisibilityButton, styles.messageVisibilityButtonFullWidth]}>
                            <View style={styles.containerRow}>
                                <FontAwesomeIcon icon={faCalendar}/>
                                <Text> {messageDate.toLocaleDateString()}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShowTime()} style={[styles.messageVisibilityButton, styles.messageVisibilityButtonFullWidth]}>
                        <View style={styles.containerRow}>
                                <FontAwesomeIcon icon={faClock}/>
                                <Text> {messageDate.toLocaleTimeString()}</Text>
                            </View>
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
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageVisibilityContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageTypeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageVisibilityButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 60,
    },
    messageTypeButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 65,
    },
    messageVisibilityButtonFullWidth: {
        width: '100%',
        borderRadius: 5,
        marginBottom: 2,
    },
    messageTypeButtonFullWidth: {
        width: '100%',
        borderRadius: 5,
        marginBottom: 2,
    },
    messageVisibilityButtonLeft: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    messageTypeButtonLeft: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    messageVisibilityButtonRight: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    messageTypeButtonRight: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    selectedVisibility: {
        backgroundColor: '#fb5b5a',
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
});


export default CreateTextMessage;