import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase';

const ExploreScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();  // useNavigation hook
  const route = useRoute();
  const { userId, username } = route.params || {};

  useEffect(() => {
    console.log("ExploreScreen - User ID:", userId);
    console.log("ExploreScreen - Username:", username);

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'approved_events'));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageUrl: doc.data().image || null,
        }));
        setEvents(eventsList);
        console.log("Fetched events:", eventsList);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch events. Please try again later.");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId, username]);

  const handleEventPress = (item) => {
    console.log("Event pressed:", item);
    Alert.alert(
      'Payment Confirmation',
      `Do you want to pay for the event: ${item.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log("Navigating to ConfirmedPaymentScreen with userId:", userId, "and username:", username);
            // Navigating to ConfirmedPaymentScreen within BottomTabs
            navigation.navigate('Home', {
              screen: 'ConfirmedPayment',
              params: {
                eventId: item.id,
                userId: userId,
                username: username,
              },
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleEventPress(item)}>
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.price}>ZMW {item.price.toFixed(2)}</Text>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <Text style={styles.noImageText}>No image available</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#888',
  },
  price: {
    fontSize: 16,
    color: '#000',
  },
  image: {
    marginTop: 8,
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noImageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
});

export default ExploreScreen;
