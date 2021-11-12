import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGEM1jRthkZMCSZH6Jdx-M9ZU5Zrx2W98",
  authDomain: "clone-a9821.firebaseapp.com",
  projectId: "clone-a9821",
  storageBucket: "clone-a9821.appspot.com",
  messagingSenderId: "713357802480",
  appId: "1:713357802480:web:d22b086dea7ffb4cd33b35"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth();
export { db, auth };