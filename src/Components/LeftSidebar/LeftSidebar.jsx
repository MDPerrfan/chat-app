import React, { useContext, useState } from 'react'
import './LeftSidebar.css'
import assests from '../../assets/assests'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'
import { toast } from 'react-toastify'
const LeftSidebar = () => {
    const { userData, chatsData,chatuser,setChatuser,setmessageId ,messageId  } = useContext(AppContext);
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
        } catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }
    const setChat=async(item)=>{
        setmessageId (item.messageId);
        setChatuser(item)
    }
    const navigate = useNavigate()
    return (
        <div className='ls'>
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
                            <div onClick={()=>setChat(item)} key={index} className="friends">
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
