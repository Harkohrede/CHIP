import {initializeApp} from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { Firestore, getFirestore} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBp4JaqMTd02vs2siOq-ij6Pig6NgT21Ak",
  authDomain: "chip-fb3c6.firebaseapp.com",
  projectId: "chip-fb3c6",
  storageBucket: "chip-fb3c6.appspot.com",
  messagingSenderId:"857278660448",
  appId: "1:857278660448:web:4f054a58411845104fa805",
  measurementId: "G-PXZ27Q5BEK",
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

// Initializing Firebase Services
const auth = getAuth(app);
const db: Firestore = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app); 


export { app, auth, db, analytics,storage };