import React, { useContext, useEffect, useState } from 'react'
import './Chatbox.css'
import assests from '../../assets/assests.js'
import { AppContext } from '../../Context/AppContext.jsx'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../Config/firebase.js'
import { toast } from 'react-toastify'
const Chatbox = () => {
  const { userData, messageId , chatuser, messages, setMessages } = useContext(AppContext);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    try {
      if (input && messageId ) {
        await updateDoc(doc(db, "messages", messageId ), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatuser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatRef)
          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messageId );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updateAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false
            }
            await updateDoc(userChatRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  }
  useEffect(() => {
    if (messageId ) {
      const unSub = onSnapshot(doc(db, "messages", messageId ), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse())
      })
      return () => {
        unSub();
      }
    }
  }, [messageId ]);
  return chatuser ? (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatuser.userData.avatar} alt="profile" className='profilem' />
        <p>{chatuser.userData.name}<img src={assests.dot} alt="active" /></p>
        <img src={assests.help} alt="help" className='help' />
      </div>
      <div className="chat-mssg">
        <div className="s-mssg">
          <p className="msg">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae facilis error, nobis rerum est corrupti eaque quaerat ut earum explicabo assumenda, ipsa vel</p>
          <div>
            <img src={assests.profile} alt="" />
            <p>21:47 PM</p>
          </div>
        </div>
        <div className="s-mssg">
          <img src={assests.profile} alt="img" className='msg-img' />          <div>
            <img src={assests.profile} alt="" />
            <p>21:47 PM</p>
          </div>
        </div>
        <div className="r-mssg">
          <p className="msg">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae facilis error, nobis rerum est corrupti eaque quaerat ut earum explicabo assumenda, ipsa vel</p>
          <div>
            <img src={assests.profile} alt="" />
            <p>21:47 PM</p>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className="send-a-message" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png,image/jpeg,image/jpg' hidden />
        <label htmlFor="image">
          <img src={assests.gallery} alt="gallery" />
        </label>
        <img onClick={sendMessage} src={assests.send} alt="sent" />
      </div>
    </div>
  )
    : <div className='chatWelcome'>
      <img src={assests.logo} alt="logo" />
      <p>Chat as you want!!</p>
    </div>
}

export default Chatbox
