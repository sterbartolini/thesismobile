import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

var config = {
  apiKey: "AIzaSyBgzYBdUhkg4o-015KSPN0BYX9YrctNdG0",
  authDomain: "emergencyresponsesystem-57dc4.firebaseapp.com",
  databaseURL: "https://emergencyresponsesystem-57dc4.firebaseio.com",
  projectId: "emergencyresponsesystem-57dc4",
  storageBucket: "emergencyresponsesystem-57dc4.appspot.com",
  messagingSenderId: "583480520859"
};
export const app = firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
const db = app.database();

export default db;
// export default app;
