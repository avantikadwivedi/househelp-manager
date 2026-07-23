// Firebase configuration - shared between employer and helper apps
const firebaseConfig = {
  apiKey: "AIzaSyBAc4dASDl2vXS_kVXVEjPs7oMv312WyXI",
  authDomain: "househelp-manager.firebaseapp.com",
  projectId: "househelp-manager",
  storageBucket: "househelp-manager.firebasestorage.app",
  messagingSenderId: "855944100314",
  appId: "1:855944100314:web:df4f1930cb6584b70f68e3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
