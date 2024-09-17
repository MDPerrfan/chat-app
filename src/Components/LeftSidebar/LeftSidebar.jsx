import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css'
import assests from '../../assets/assests'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'
import { toast } from 'react-toastify'
const LeftSidebar = () => {
    const { userData, chatsData,chatuser,setChatuser,setmessageId ,messageId,chatVisible,setChatVisible  } = useContext(AppContext);
    const [user, setUser] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input) {
                setShowSearch(true)
                const userRef = collection(db, "users");
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);
                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                    let userExist = false;
                    chatsData.map((user) => {
                        if (user.rId === querySnap.docs[0].data().id) {
                            userExist = true;
                        }
                    })
                    if (!userExist) {
                        setUser(querySnap.docs[0].data());
                    }
                } else {
                    setUser(null)
                }
            } else {
                setShowSearch(false);
            }

        } catch (error) {
            console.log(error)
        }
    }
    const addChat = async () => {
        const mssgRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");
        try {
            const newMssgRef = doc(mssgRef);
            await setDoc(newMssgRef, {
                createAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMssgRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updateAt: Date.now(),
                    messageSeen: true
                })
            })
            const uSnap = await getDoc(doc(db,"users",user.id));
            const uData = uSnap.data();
            setChat({
                messageId:newMssgRef.id,
                lastMessage:"",
                rId:user.id,
                updatedAt:Date.now(),
                messageSeen:true,
                userData:uData
            })
            setShowSearch(false)
            setChatVisible(true)
        } catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }
    const setChat = async (item) => {
        try {
          setmessageId(item.messageId);
          setChatuser(item);
          
          const userChatRef = doc(db, "chats", userData.id);
          const userChatsSnapshot = await getDoc(userChatRef);
      
          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex(
              (c) => c.messageId === item.messageId
            );
      
            if (chatIndex !== -1) {
              // Mark the chat as seen
              userChatsData.chatsData[chatIndex].messageSeen = true;
              
              await updateDoc(userChatRef, {
                chatsData: userChatsData.chatsData,
              });
            }
          }
          setChatVisible(true)
        } catch (error) {
          toast.error(error.message);
        }
      };
      
    const navigate = useNavigate();

    useEffect(()=>{
        const updateChatUserData = async()=>{
        if(chatuser){
            const userRef = doc(db,"users",chatuser.userData.id);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setChatuser(prev=>({...prev,userData:userData}))
        }
        }
        updateChatUserData()
    },[chatsData])
    return (
        <div className={`ls ${chatVisible?"hidden":""}`}>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assests.mssg} alt="logo" className='logo' />
                    <div className="menu">
                        <img src={assests.menu} alt="menu" />
                        <div className="sub-menu">
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assests.search} alt="search" style={{ maxWidth: "25px" }} />
                    <input onChange={inputHandler} type="text" placeholder='search here' />
                </div>
                <div className="ls-list">
                    {showSearch && user ?
                        <div onClick={addChat} className='friends add-user'>
                            <img src={user.avatar} alt="avtr" />
                            <p>{user.name}</p>
                        </div>
                        :
                        chatsData.map((item, index) => (
                            <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen && messageId? "":"border"}`}>
                                <img src={item.userData.avatar} alt="avatar" />
                                <div>
                                    <p>{item.userData.name}</p>
                                    <span>{item.lastMessage}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar
