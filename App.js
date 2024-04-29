import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image,Button } from "react-native";
import "expo-dev-client";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
      "188749471774-beaqv66ld59kt847ak7ak1bmrhg7s95t.apps.googleusercontent.com",
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    //return auth().signInWithCredential(googleCredential);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut(); // corrected from auth().SignOut()
    } catch (error) {
      console.error(error);
    }
  };

  if (initializing) return null;
  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text style={styles.text}>Welcome, {user.displayName}</Text>
          <Image
            source={{ uri: user.photoURL }}
            style={{ height: 200, width: 200, borderRadius: 150, margin: 60 }}
          />
          <Button title="Sign Out" onPress={SignOut} />
        </View>
      ) : (
        <GoogleSigninButton
          style={{ width: 300, height: 65, marginTop: 300 }}
          onPress={onGoogleButtonPress}
        />
      )}
    </View>
  );
}
// return (
//   <View style={styles.container}>
//     <Text>Welcome, {user.displayName}</Text>
//     {/* <Image source={{ uri: user.photoURL }}/> */}
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
