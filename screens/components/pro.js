import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Pro = () => {
  console.log("Pro component is rendering");
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account Settings</Text>
        <SettingItem icon="person-outline" label="Profile" />
        <SettingItem icon="calendar-outline" label="My Booking" />
        <SettingItem icon="wallet-outline" label="Wallet" />
        <SettingItem icon="heart-outline" label="Favorite" />
        <SettingItem icon="notifications-outline" label="Notification" />
        <SettingItem icon="people-outline" label="Refer a Friend" />
        <SettingItem icon="moon-outline" label="Dark Mode" switchItem />
        <SettingItem icon="document-outline" label="Privacy Policy" />
        <SettingItem icon="document-text-outline" label="Terms & Conditions" />
        <SettingItem icon="call-outline" label="Contact Us" />
      </View>
    </ScrollView>
  );
};

const SettingItem = ({ icon, label, switchItem }) => {
  return (
    <View style={styles.settingItem}>
      <Ionicons name={icon} size={24} color="#000" />
      <Text style={styles.settingText}>{label}</Text>
      {switchItem ? <Switch style={styles.switch} /> : <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  switch: {
    marginLeft: 'auto',
  },
});

export default Pro;
