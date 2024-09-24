import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase'; // Ensure the correct firebase.js path
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Add state to store logged-in user details

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      console.log('Validation Error: Missing email or password');
      return;
    }

    console.log(`Attempting login with email: ${email}`);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Login successful', user);

      // Fetch the username from Firestore
      const userDoc = await getDoc(doc(db, "customers", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.name;

        console.log('User data fetched from Firestore:', userData);

        // Set the logged-in user details
        setLoggedInUser({ username, email: user.email });

        Alert.alert('Success', `Welcome, ${username}! You have successfully logged in!`);
        console.log(`User ${username} logged in successfully`);

        // Navigate to BottomTabs and pass username
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { userId: user.uid, username: username } }],
        });
      } else {
        Alert.alert('Error', 'User data not found.');
        console.log('Error: User data not found');
      }
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/user-disabled':
          errorMessage = "User account has been disabled.";
          break;
        case 'auth/user-not-found':
          errorMessage = "User not found.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        default:
          errorMessage = "Login failed. Please check your credentials.";
          break;
      }
      Alert.alert("Login Error", errorMessage);
      console.log(`Login error: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./images/im1.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Get-Your-Soft-Ticket</Text>
      <Text style={styles.subtitle}>Let's Sign You In</Text>
      <Text style={styles.description}>Welcome back, you've been missed</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.rememberMeButton, rememberMe && styles.rememberMeActive]}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <Text style={styles.rememberMeText}>{rememberMe ? 'Active' : 'Inactive'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Show logged-in user info if available */}
      {loggedInUser && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Logged in as: {loggedInUser.username}</Text>
          <Text style={styles.userInfoText}>Email: {loggedInUser.email}</Text>
        </View>
      )}

      <Text style={styles.signupPrompt}>
        Don't have an account?{" "}
        <Text style={styles.signupText} onPress={() => navigation.navigate('Signup')}>
          Sign up here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    color: '#888',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  rememberMeButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderColor: '#1E90FF',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  rememberMeActive: {
    backgroundColor: '#1E90FF',
  },
  rememberMeText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  userInfoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  userInfoText: {
    fontSize: 16,
    color: '#555',
  },
  signupPrompt: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
  signupText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
