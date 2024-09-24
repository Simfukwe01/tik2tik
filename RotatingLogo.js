import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, Easing } from 'react-native';

const RotatingLogo = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000, // Adjust rotation speed (milliseconds)
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('./images/im1.jpeg')}
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200, // Increased width
    height: 200, // Increased height
    borderRadius: 100, // Border radius to make it circular
    resizeMode: 'contain',
  },
});

export default RotatingLogo;
