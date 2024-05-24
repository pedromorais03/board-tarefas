import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDvhO2D_sdaVT4ASSBjXwwKIEWHvA4JL4Y",
  authDomain: "board-tarefas-8ec27.firebaseapp.com",
  projectId: "board-tarefas-8ec27",
  storageBucket: "board-tarefas-8ec27.appspot.com",
  messagingSenderId: "69311174976",
  appId: "1:69311174976:web:a1827ded536a9176d842a5"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export {db}