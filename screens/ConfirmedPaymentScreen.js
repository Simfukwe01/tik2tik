import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct import path for your firebase.js

const ConfirmedPaymentScreen = ({ route }) => {
  // Extract userId and username from route parameters
  const { userId, username } = route.params || {}; 

  // Log userId and username for debugging
  useEffect(() => {
    console.log("ConfirmedPaymentScreen Mounted");
    console.log("User ID:", userId);
    console.log("Username:", username);
  }, [userId, username]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [showTransactionPrompt, setShowTransactionPrompt] = useState(false);

  // Load payment methods from Firestore when the component mounts
  useEffect(() => {
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
  }, []);

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
      // Generate a unique ID for the transaction
      const uniqueId = generateUniqueId();
      
      // Validate userId and username
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

      // Add the payment details to Firestore
      await addDoc(collection(db, 'pendingPayments'), {
        paymentMethod: selectedCard.phoneNumber,
        transactionId: inputCode,
        phoneNumber: phoneNumber,
        userId: validUserId,  // Ensure userId is not undefined
        username: validUsername,  // Ensure username is not undefined
        uniqueId,
        timestamp: new Date(),
        status: 'Pending', // Set initial status to 'Pending'
      });

      Alert.alert("Success", `Payment recorded under ${validUsername}. Please wait for confirmation from the admin.`);
      
      // Clear form and reset state
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
    // Generate a unique ID (for simplicity, using timestamp + random number)
    return `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  // Update card data to include fetched payment methods
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  transactionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  accountInfo: {
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ConfirmedPaymentScreen;
