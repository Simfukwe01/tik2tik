// screens/UpcomingScreen.js
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Card from './components/cards';

const UpcomingScreen = () => {
  const cardsData = [
    {
      imageSource: require('../images/BW2.jpeg'),
      comment: 'This is the first upcoming event.',
    },
    {
      imageSource: require('../images/im1.jpeg'),
      comment: 'This is the second upcoming event.',
    },
    {
      imageSource: require('../images/im2.jpeg'),
      comment: 'This is the second upcoming event.',
    },

    {
      imageSource: require('../images/7.jpeg'),
      comment: 'This is the second upcoming event.',
    },


    {
      imageSource: require('../images/f.jpeg'),
      comment: 'This is the second upcoming event.',
    },


    {
      imageSource: require('../images/7.jpeg'),
      comment: 'This is the second upcoming event.',
    },
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

export default UpcomingScreen;
