import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import { db } from '../firebase'; // Ensure the correct import path for your firebase.js

const PaymentStatusScreen = ({ route }) => {
  const { userId } = route.params || {};
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    // Listener for payment status updates
    const paymentRef = doc(db, 'acceptedPayments', userId);
    const unsubscribe = onSnapshot(paymentRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPaymentStatus(data.status);
        setQrCodeValue(data.qrCode || '');
      } else {
        setPaymentStatus('Failed');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  return (
    <View style={styles.container}>
      {paymentStatus === 'Approved' ? (
        <>
          <Text style={styles.successText}>Payment Approved</Text>
          <QRCode value={qrCodeValue} size={200} />
          <Text style={styles.qrText}>Show this QR code as proof of your transaction.</Text>
        </>
      ) : paymentStatus === 'Failed' ? (
        <Text style={styles.errorText}>Transaction Failed</Text>
      ) : (
        <Text style={styles.loadingText}>Checking payment status...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  successText: {
    fontSize: 24,
    color: '#32CD32',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 24,
    color: '#FF6347',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  qrText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default PaymentStatusScreen;
