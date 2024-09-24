// SplashScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import RotatingLogo from './RotatingLogo'; // Import RotatingLogo component

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login'); // Replace 'Login' with the name of your login screen
    }, 2000); // Adjust the timeout as needed
  }, [navigation]);

  return (
    <View style={styles.container}>
      <RotatingLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set background color
  },
});

export default SplashScreen;
