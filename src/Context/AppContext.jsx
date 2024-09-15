import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserdata] = useState(null);
    const [chatsData, setchatData] = useState([]);
    const [messageId ,setmessageId ]=useState(null);
    const [messages,setMessages]=useState([]);
    const [chatuser,setChatuser]=useState(null);
    const [chatVisible,setChatVisible]=useState(false)
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
      useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);
    
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data()?.chatsData || [];  // Ensure chatItems is not undefined
                const tempData = [];
                
                for (const item of chatItems) {
                    const userRef = doc(db, "users", item.rId);
                    const userSnap = await getDoc(userRef);  // Await the getDoc call
                    
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        tempData.push({ ...item, userData });
                    }
                }
    
                // Sort the chat data by updatedAt in descending order
                setchatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            });
    
            return () => unSub();  // Cleanup subscription on component unmount
        }
    }, [userData]);

    const value = {
        userData, setUserdata, chatsData, setchatData,
        loadUserData,messages,setMessages,messageId ,setmessageId ,setChatuser,chatuser,
        chatVisible,setChatVisible
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;