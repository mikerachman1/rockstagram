import fb from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHB8IG45jiU0HgCIilZ0H6ebhb5ZY2Vs0",
  authDomain: "rockstagram-9e421.firebaseapp.com",
  projectId: "rockstagram-9e421",
  storageBucket: "rockstagram-9e421.appspot.com",
  messagingSenderId: "868998459105",
  appId: "1:868998459105:web:460392a24d1225206111a0"
};

const firebaseApp = fb.initializeApp(firebaseConfig)

const db = firebaseApp.firestore();
const auth = fb.auth();
const storage = fb.storage();

export { db, auth, storage, fb };