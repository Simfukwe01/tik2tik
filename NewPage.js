// NewPage.js
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';

export default function NewPage({ navigation }) {
  return (
    <ImageBackground 
      source={require('./images/im1.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Explore Upcoming and Nearby Events</Text>
        <Text style={styles.pageDescription}>
          Use this software platform to book your ticket ahead of our Events
        </Text>
        
        <View style={styles.navigationContainer}>
          <TouchableOpacity>
            <Text style={styles.navigationText}>Skip</Text>
          </TouchableOpacity>
          
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          
          <TouchableOpacity onPress={() => navigation.replace('Home')}>
            <Text style={styles.navigationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%', // Ensure the image takes the full width of its container
    height: '100%', // Ensure the image takes the full height of its container
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent overlay
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 30,
    paddingHorizontal: 20,
  },
  navigationText: {
    fontSize: 16,
    color: '#fff',
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});
