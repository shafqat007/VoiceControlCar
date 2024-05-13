import firebase from 'firebase/compat/app'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyC63gYzz8X91iZxrCSqbIOTIlpyLj00gcA",
    authDomain: "carproject-ea251.firebaseapp.com",
    databaseURL: "https://carproject-ea251-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "carproject-ea251",
    storageBucket: "carproject-ea251.appspot.com",
    messagingSenderId: "604178093850",
    appId: "1:604178093850:web:bc180ec3ed730746b5bea3"
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
  }
    const db = getDatabase()
    export {db}