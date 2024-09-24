// screens/CancelledScreen.js
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Card from './components/cards';

const CancelledScreen = () => {
  const cardsData = [
    {
      imageSource: require('../images/mk2.jpeg'),
      comment: 'This is the first cancelled event.',
    },
    {
      imageSource: require('../images/emi2.jpeg'),
      comment: 'This is the second cancelled event.',
    },
    // Add more card data as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {cardsData.map((card, index) => (
        <Card key={index} imageSource={card.imageSource} comment={card.comment} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default CancelledScreen;
