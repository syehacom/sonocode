import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBosPi-THxVuN1ohEY4_j5j4oYCQvrCVT8",
    authDomain: "opencode-be58c.firebaseapp.com",
    databaseURL: "https://opencode-be58c-default-rtdb.firebaseio.com",
    projectId: "opencode-be58c",
    storageBucket: "opencode-be58c.appspot.com",
    messagingSenderId: "619383868360",
    appId: "1:619383868360:web:d44cf4e42d20aa18a54efd",
};
firebase.initializeApp(firebaseConfig);

export default firebase;
