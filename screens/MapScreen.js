import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, Alert, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct import path for your firebase.js

export default function MapScreen({ route }) {
  const { userId, username } = route.params || {};
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [showTransactionPrompt, setShowTransactionPrompt] = useState(false);

  useEffect(() => {
    console.log("MapScreen Mounted");
    console.log("User ID:", userId);
    console.log("Username:", username);

    (async () => {
      console.log("Requesting location permissions...");
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status !== 'granted') {
        alert('Permission to access location was denied');
        console.log("Permission denied.");
        return;
      }

      console.log("Getting current location...");
      let loc = await Location.getCurrentPositionAsync({});
      console.log("Location retrieved:", loc);

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setLoading(false);
      console.log("Location set:", location);
    })();

    // Fetch payment methods
    const loadPaymentMethods = async () => {
      console.log("Fetching payment methods...");
      const methods = ['airtel', 'mtn', 'zanaco', 'fnb'];
      const fetchedMethods = {};
      for (const method of methods) {
        try {
          const docRef = doc(db, 'paymentMethods', method);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            fetchedMethods[method] = docSnap.data().account;
            console.log(`${method} payment method fetched:`, docSnap.data().account);
          } else {
            console.log(`No document found for ${method}`);
          }
        } catch (error) {
          console.error(`Error fetching ${method} payment method:`, error);
        }
      }
      setPaymentMethods(fetchedMethods);
    };

    loadPaymentMethods();
  }, [userId, username]);

  if (loading) {
    console.log("Loading location...");
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading your location...</Text>
      </View>
    );
  }

  const handleCardPress = (card) => {
    console.log("Card selected:", card);
    setSelectedCard(card);
    setShowTransactionPrompt(true);
    setModalVisible(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedCard || !inputCode || !phoneNumber) {
      Alert.alert("Error", "Please select a card, enter the code, and provide your phone number.");
      return;
    }

    try {
      const uniqueId = generateUniqueId();
      const validUserId = userId || "Unknown User";
      const validUsername = username || "Unknown";

      console.log("Submitting payment...");
      console.log("Payment Details:", {
        paymentMethod: selectedCard.phoneNumber,
        transactionId: inputCode,
        phoneNumber: phoneNumber,
        userId: validUserId,
        username: validUsername,
        uniqueId,
        timestamp: new Date(),
        status: 'Pending',
      });

      await addDoc(collection(db, 'pendingPayments'), {
        paymentMethod: selectedCard.phoneNumber,
        transactionId: inputCode,
        phoneNumber: phoneNumber,
        userId: validUserId,
        username: validUsername,
        uniqueId,
        timestamp: new Date(),
        status: 'Pending',
      });

      Alert.alert("Success", `Payment recorded under ${validUsername}. Please wait for confirmation from the admin.`);
      
      setSelectedCard(null);
      setInputCode('');
      setPhoneNumber('');
      setModalVisible(false);
      setShowTransactionPrompt(false);
    } catch (error) {
      Alert.alert("Error", "Failed to record payment.");
      console.error("Error adding payment: ", error);
    }
  };

  const generateUniqueId = () => {
    return `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const cardsData = [
    {
      imageSource: require('../payment/pay5.jpeg'),
      comment: 'Pay with Zamtel.',
      phoneNumber: paymentMethods['airtel'] || '0955407822'
    },
    {
      imageSource: require('../payment/pay3.jpeg'),
      comment: 'Pay With Zanaco.',
      phoneNumber: paymentMethods['zanaco'] || '1000'
    },
    {
      imageSource: require('../payment/pay2.jpeg'),
      comment: 'Pay with MoMo.',
      phoneNumber: paymentMethods['mtn'] || '0769030825'
    },
    {
      imageSource: require('../payment/pay0.jpeg'),
      comment: 'Pay with Airtel Money.',
      phoneNumber: paymentMethods['fnb'] || '0973794651'
    },
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={location}>
        <Marker coordinate={location} title="You are here" />
      </MapView>

      <ScrollView>
        {cardsData.map((card, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(card)}>
            <View style={styles.card}>
              <Image source={card.imageSource} style={styles.image} />
              <Text style={styles.cardText}>{card.comment}</Text>
              <Text style={styles.cardSubText}>Phone: {card.phoneNumber}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCard && (
              <>
                <Image source={selectedCard.imageSource} style={styles.image} />
                <Text style={styles.cardText}>{selectedCard.comment}</Text>
                {showTransactionPrompt && (
                  <View style={styles.transactionContainer}>
                    <Text style={styles.transactionHeader}>Enter Transaction Details</Text>
                    <Text style={styles.accountInfo}>
                      Account to use: {selectedCard.phoneNumber}
                    </Text>
                    <TextInput
                      placeholder="Enter code"
                      value={inputCode}
                      onChangeText={setInputCode}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      style={styles.input}
                    />
                    <View style={styles.buttonContainer}>
                      <Button title="Submit Payment" onPress={handleSubmitPayment} color="#32CD32" />
                      <Button title="Close" onPress={() => setModalVisible(false)} color="#FF6347" />
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  transactionContainer: {
    width: '100%',
    marginTop: 20,
  },
  transactionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accountInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
