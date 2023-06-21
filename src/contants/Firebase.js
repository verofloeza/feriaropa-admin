import Data from "./Data";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: Data.APIKEY_FIRE,
  authDomain: "feria-ropa-123.firebaseapp.com",
  projectId: "feria-ropa-123",
  storageBucket: "feria-ropa-123.appspot.com",
  messagingSenderId: Data.IDMESSAGE_FIRE,
  appId: Data.APPID_FIRE
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, app, storage};