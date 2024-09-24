import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Button, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Use your existing Firebase configuration
const db = getFirestore();

const favoritesData = [
  { id: '1', title: 'Favorite 1', image: require('../images/yo-maps.jpeg') },
  { id: '2', title: 'Favorite 2', image: require('../images/zedtrend.jpeg') },
  { id: '3', title: 'Favorite 3', image: require('../images/nez0.jpeg') },
  { id: '4', title: 'Favorite 4', image: require('../images/87.jpeg') },
  { id: '5', title: 'Favorite 5', image: require('../images/yceleb.jpeg') },
  { id: '6', title: 'Favorite 6', image: require('../images/mk2.jpeg') },
  { id: '7', title: 'Favorite 7', image: require('../images/yo-maps.jpeg') },
  { id: '8', title: 'Favorite 8', image: require('../images/7.jpeg') },
  { id: '9', title: 'Favorite 9', image: require('../images/nez.jpeg') },
];

const FavoriteScreen = () => {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  const handleFavoritePress = (item) => {
    setSelectedFavorite(item);
  };

  const handlePaymentSubmission = async () => {
    if (!transactionId) {
      Alert.alert('Error', 'Please enter a transaction ID.');
      return;
    }

    try {
      const paymentData = {
        favoriteId: selectedFavorite.id,
        title: selectedFavorite.title,
        transactionId,
        timestamp: new Date(),
      };
      await addDoc(collection(db, 'payments'), paymentData);
      Alert.alert('Success', 'Payment submitted successfully.');
      setTransactionId('');
      setSelectedFavorite(null);
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'There was an error submitting the payment.');
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Button title="Select" onPress={() => handleFavoritePress(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Favorites</Text>
      <FlatList
        data={favoritesData}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      {selectedFavorite && (
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentHeading}>Selected: {selectedFavorite.title}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
          />
          <Button title="Submit Payment" onPress={handlePaymentSubmission} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  paymentContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  paymentHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 10,
  },
});

export default FavoriteScreen;
