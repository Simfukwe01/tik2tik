import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, Alert } from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Ensure the correct import path for your firebase.js

const BookingTabs = ({ route }) => {
  const { userId, username } = route.params || {}; // Extract userId and username from route params

  const [pendingPayments, setPendingPayments] = useState([]);
  const [acceptedPayments, setAcceptedPayments] = useState([]);
  const [failedPayments, setFailedPayments] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // State to hold the QR code URL
  const [activeTab, setActiveTab] = useState('Upcoming');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        // Fetch pending payments
        const pendingQuery = query(collection(db, 'pendingPayments'), where('userId', '==', userId));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingList = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingPayments(pendingList);

        // Fetch accepted payments
        const acceptedQuery = query(collection(db, 'acceptedPayments'), where('userId', '==', userId));
        const acceptedSnapshot = await getDocs(acceptedQuery);
        const acceptedList = acceptedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAcceptedPayments(acceptedList);

        // Fetch QR code from the first accepted payment
        if (acceptedList.length > 0 && acceptedList[0].qrCode) {
          setQrCodeUrl(acceptedList[0].qrCode); // Set the QR code URL
        }

        // Fetch failed payments
        const failedQuery = query(collection(db, 'failedPayments'), where('userId', '==', userId));
        const failedSnapshot = await getDocs(failedQuery);
        const failedList = failedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFailedPayments(failedList);
      } catch (error) {
        console.error("Error loading payments: ", error);
        Alert.alert("Error", "Failed to load payments.");
      }
    };

    loadPayments();
  }, [userId]);

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>Username: {item.username}</Text>
      <Text style={styles.paymentText}>Payment Method: {item.paymentMethod}</Text>
      <Text style={styles.paymentText}>Transaction ID: {item.transactionId}</Text>
      <Text style={styles.paymentText}>Phone Number: {item.phoneNumber}</Text>
      <Text style={styles.paymentText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Button title="Upcoming" onPress={() => setActiveTab('Upcoming')} />
        <Button title="Completed" onPress={() => setActiveTab('Completed')} />
        <Button title="Cancelled" onPress={() => setActiveTab('Cancelled')} />
      </View>

      {activeTab === 'Upcoming' && (
        <FlatList
          data={pendingPayments}
          renderItem={renderPaymentItem}
          keyExtractor={item => item.id}
        />
      )}
      {activeTab === 'Completed' && (
        <>
          <FlatList
            data={acceptedPayments}
            renderItem={renderPaymentItem}
            keyExtractor={item => item.id}
          />
          {qrCodeUrl && (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>Your QR Code:</Text>
              <Image
                source={{ uri: qrCodeUrl }}
                style={styles.qrCodeImage}
                resizeMode="contain"
              />
            </View>
          )}
        </>
      )}
      {activeTab === 'Cancelled' && (
        <FlatList
          data={failedPayments}
          renderItem={renderPaymentItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 8,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
  },
});

export default BookingTabs;
