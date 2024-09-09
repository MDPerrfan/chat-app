import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserdata] = useState(null);
    const [chatData, setchatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
          const userRef = doc(db, "users", uid); // Ensure correct path
          const userSnap = await getDoc(userRef);
      
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserdata(userData);
            if(userData.avatar && userData.name){
                navigate('/chat')
            }else{
                navigate('/profile')
            }
            await updateDoc (userRef,{
                lastSeen:Date.now()
            })
            setInterval(async()=>{
                if(auth){
                    await updateDoc(userRef,{
                        lastSeen:Date.now()
                    })
                }
            },60000);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    const value = {
        userData, setUserdata, chatData, setchatData,
        loadUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;