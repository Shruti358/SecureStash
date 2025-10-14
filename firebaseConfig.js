// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbquiPVnF4Y-ah_XGASVLVYTpKGRHg5yM",
  authDomain: "stash-37011.firebaseapp.com",
  databaseURL: "https://stash-37011-default-rtdb.firebaseio.com",
  projectId: "stash-37011",
  storageBucket: "stash-37011.firebasestorage.app",
  messagingSenderId: "429510629131",
  appId: "1:429510629131:web:793bf67ffad3a4c17df40e",
  measurementId: "G-BHTMFPB2VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);