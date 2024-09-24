import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const Card = ({ imageSource, number, label }) => {
  return (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={imageSource} />
      <Text style={styles.cardNumber}>{number}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 24,
    color: '#333',
  },
  cardLabel: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default Card;
