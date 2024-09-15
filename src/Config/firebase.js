import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, getDoc, getDocs, where } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
    apiKey: "AIzaSyBdayumQtY_APzefHnk1c8zTD68GORLYhg",
    authDomain: "chat-app-1af18.firebaseapp.com",
    projectId: "chat-app-1af18",
    storageBucket: "chat-app-1af18.appspot.com",
    messagingSenderId: "20435981865",
    appId: "1:20435981865:web:317a757985f0a882b92e38"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async(username, email, password) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey!I am using P-Chat",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
const login = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
const logout = async() => {
    try {
        await signOut(auth)
    } catch (error) {
        toast.error(error.code.split('/')[1].split('-').join(" "));

    }
}
const resetPass = async(email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email));
        const querySnap = getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent!")
        } else {
            toast.error("Email doesn't exists!")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}
export { signUp, login, logout, auth, db, resetPass }