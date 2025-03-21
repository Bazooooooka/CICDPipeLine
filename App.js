import React from "react";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./src/infrastructre/theme";

import {
  useFonts as useOswald,
  Oswald_400Regular,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { Navigation } from "./src/infrastructre/navigation/index";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { initializeApp } from "firebase/app";
import { PermissionsAndroid } from "react-native";
import { getApp } from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
//import notifee from "@notifee/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCMAp3P0Gn89eWXNi5kOpsFOjA-_Qk0Muc",
  authDomain: "mealstogo-b79a5.firebaseapp.com",
  projectId: "mealstogo-b79a5",
  storageBucket: "mealstogo-b79a5.appspot.com",
  messagingSenderId: "456772287905",
  appId: "1:456772287905:web:972d8f7948e3b8c9b31fe0",
  measurementId: "G-0KV4ZMSCXY",
};
initializeApp(firebaseConfig);

const isAndroid = Platform.OS === "android";

export default function App() {
  useEffect(() => {
    if (isAndroid) {
      requestUserPermission();
    } else {
      requestUseriOSPermission();
    }
  }, []);
  useEffect(() => {
    const unsubscribe = getApp()
      .messaging()
      .onMessage(async (remoteMessage) => {
        alert(`A new FCM message arrived! ${JSON.stringify(remoteMessage)}`);
        // onDisplayNotification(remoteMessage);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Handle background or quit state notifications when tapped
    const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from background:",
            remoteMessage
          );
          // Handle navigation or logic here
        }
      }
    );

    // Handle notifications that launch the app from a fully closed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
          // Handle navigation or logic here
        }
      });

    return unsubscribeOnOpen; // Clean up the listener
  }, []);

  async function onDisplayNotification(remoteMessage) {
    // Request permissions (required for iOS)

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: "Main body content of the notification",
      android: {
        channelId,
        smallIcon: "name-of-a-small-icon", // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: "default",
        },
      },
    });
  }

  const [oswaldLoaded] = useOswald({
    Oswald_400Regular,
  });

  const [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }

  async function requestUserPermission() {
    const authStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (authStatus == PermissionsAndroid.RESULTS.GRANTED) {
      const token = await getApp().messaging().getToken();
      // alert(token);

      console.log(token);
    } else {
      alert("not Authorization status:");
    }
  }
  async function requestUseriOSPermission() {
    const authStatus = await getApp().messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await getApp().messaging().getToken();

      console.log("Authorization status:", token);
    } else {
      console.log("Not Granted");
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthenticationContextProvider>
          <Navigation />
        </AuthenticationContextProvider>
      </ThemeProvider>
    </>
  );
}
