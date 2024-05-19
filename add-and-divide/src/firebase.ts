import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA2Gf-upN9m8xtHhiT3cDT0oCPuiJSg28U",
  authDomain: "addanddivide-32da3.firebaseapp.com",
  projectId: "addanddivide-32da3",
  storageBucket: "addanddivide-32da3.appspot.com",
  messagingSenderId: "1050334056028",
  appId: "1:1050334056028:web:2435c8b3fd94ae871a2099",
  measurementId: "G-YBT8TV115T"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
