import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCgzx-fXq8R33ii8FFQXXI-U6KtLnCUSAU",
    authDomain: "my-market-6f3dd.firebaseapp.com",
    projectId: "my-market-6f3dd",
    storageBucket: "my-market-6f3dd.appspot.com",
    messagingSenderId: "280809574748",
    appId: "1:280809574748:web:bf1082899acf8892823199",
    measurementId: "G-4B5YV1Y3SZ"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
