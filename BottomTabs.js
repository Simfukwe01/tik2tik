import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from './screens/ExploreScreen';
import MapScreen from './screens/MapScreen';
import BookingTabs from './BookingTabs';
import FavouriteScreen from './screens/FavouriteScreen';
import Pro from './pro';
import ConfirmedPaymentScreen from './screens/ConfirmedPaymentScreen'; // Import ConfirmedPaymentScreen
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabs({ route }) {
  const { userId, username } = route.params || {};

  // Log userId and username for debugging
  React.useEffect(() => {
    console.log("BottomTabs - User ID:", userId);
    console.log("BottomTabs - Username:", username);
  }, [userId, username]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Booking') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'ConfirmedPayment') {
            iconName = focused ? 'checkmark' : 'checkmark-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
      <Tab.Screen 
        name="Booking" 
        component={BookingTabs} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
      <Tab.Screen 
        name="Favorite" 
        component={FavouriteScreen} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
      <Tab.Screen 
        name="Profile" 
        component={Pro} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
      <Tab.Screen 
        name="ConfirmedPayment" 
        component={ConfirmedPaymentScreen} 
        initialParams={{ userId: userId, username: username }} // Pass userId and username
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
