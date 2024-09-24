import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { getDoc, doc, addDoc, collection } from 'firebase/firestore';
import { db } from './firebase'; // Ensure the correct import path for your firebase.js

const BuyTicketScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [showTransactionPrompt, setShowTransactionPrompt] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});

  // Load payment methods from Firestore when the component mounts
  useEffect(() => {
    const loadPaymentMethods = async () => {
      const methods = ['airtel', 'mtn', 'zanaco', 'fnb'];
      const fetchedMethods = {};
      for (const method of methods) {
        const docRef = doc(db, 'paymentMethods', method);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          fetchedMethods[method] = docSnap.data().account;
        }
      }
      setPaymentMethods(fetchedMethods);
    };

    loadPaymentMethods();
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    setShowTransactionPrompt(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedMethod || !transactionId) {
      Alert.alert("Error", "Please select a payment method and enter the transaction ID.");
      return;
    }

    try {
      // Add the payment details to Firestore
      const uniqueId = generateUniqueId(); // Generate a unique ID for the transaction
      await addDoc(collection(db, 'paid'), {
        paymentMethod: selectedMethod,
        transactionId,
        uniqueId,
        timestamp: new Date(),
      });

      Alert.alert("Success", `Payment recorded. Your unique ID is ${uniqueId}.`);
      // Clear form and reset state
      setSelectedMethod(null);
      setTransactionId('');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Select Payment Method</Text>
      
      {Object.keys(paymentMethods).map((method) => (
        <TouchableOpacity
          key={method}
          style={[styles.card, selectedMethod === method && styles.selectedCard]}
          onPress={() => handlePaymentMethodSelect(method)}
        >
          <Text style={styles.cardText}>{method.charAt(0).toUpperCase() + method.slice(1)} Money</Text>
          <Text style={styles.cardSubText}>Account: {paymentMethods[method]}</Text>
        </TouchableOpacity>
      ))}

      {showTransactionPrompt && (
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionHeader}>Enter Transaction Details</Text>
          <Text style={styles.accountInfo}>
            Account to use: {paymentMethods[selectedMethod]}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Transaction ID"
            value={transactionId}
            onChangeText={setTransactionId}
          />
          <Button title="Submit Payment" onPress={handleSubmitPayment} color="#32CD32" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#d3d3d3',
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
});

export default BuyTicketScreen;
