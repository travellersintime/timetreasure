import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';


const Footer = (props: Props) => {
    const navigation = useNavigation();
    const [activeIcon, setActiveIcon] = useState('MessageFeed');

    useEffect(() => {
    // Navigate to the activeIcon route after state update
    navigation.navigate(activeIcon);
  }, [activeIcon, navigation]);

    const handleIconClick = (routeName) => {
    setActiveIcon(routeName); // Update active icon immediately
  };

    return (
        <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => handleIconClick('MyProfile')}>
                <FontAwesomeIcon icon={faUser} size={30} color={activeIcon === 'MyProfile' ? '#fb5b5a' : null}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => handleIconClick('MessageFeed')}>
                <FontAwesomeIcon icon={faHouse} size={30} color={activeIcon === 'MessageFeed' ? '#fb5b5a' : null}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => handleIconClick('CreateTextMessage')}>
                <FontAwesomeIcon icon={faCirclePlus} size={30} color={activeIcon === 'CreateTextMessage' ? '#fb5b5a' : null}/>
            </TouchableOpacity>
        </View>
    );
}

const styles=StyleSheet.create({
    bottomBtn: {
        paddingVertical: 20,
    },
});

export default Footer;