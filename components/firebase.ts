// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgzx-fXq8R33ii8FFQXXI-U6KtLnCUSAU",
    authDomain: "my-market-6f3dd.firebaseapp.com",
    projectId: "my-market-6f3dd",
    storageBucket: "my-market-6f3dd.appspot.com",
    messagingSenderId: "280809574748",
    appId: "1:280809574748:web:bf1082899acf8892823199",
    measurementId: "G-4B5YV1Y3SZ"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);


