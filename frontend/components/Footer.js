import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';


const Footer = (props: Props) => {
    const navigation = useNavigation();

    return (
        <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate('MyProfile')}>
                <FontAwesomeIcon icon={faUser} size={30}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate('MessageFeed')}>
                <FontAwesomeIcon icon={faHouse} size={30}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate('CreateTextMessage')}>
                <FontAwesomeIcon icon={faCirclePlus} size={30}/>
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