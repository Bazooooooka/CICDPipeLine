import { registerRootComponent } from "expo";
// import { getApp } from "@react-native-firebase/app";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

// getApp()
//   .messaging()
//   .setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log("Message handled in the background!", remoteMessage);
//   });
registerRootComponent(App);
