import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBpr7Xr4yPgYeBaEzI_mxOt7ChmH6PwABE',
  authDomain: 'spotify-clone-7f3d6.firebaseapp.com',
  databaseURL: 'https://spotify-clone-7f3d6-default-rtdb.firebaseio.com',
  projectId: 'spotify-clone-7f3d6',
  storageBucket: 'spotify-clone-7f3d6.appspot.com',
  messagingSenderId: '275147035366',
  appId: '1:275147035366:web:12e29c10bbba819e3ce127',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

export default db;
