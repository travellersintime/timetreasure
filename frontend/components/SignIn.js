import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return; // Prevent multiple login attempts
    setIsLoggingIn(true);

    try {
      // authentication logic here
      // make an API request to verify credentials

      // if successful login => navigate to the next screen

    } catch (error) {
      
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign in" onPress={handleLogin} disabled={isLoggingIn} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },
});

export default SignIn;
