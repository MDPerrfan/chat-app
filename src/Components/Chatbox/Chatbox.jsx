import React, { useContext, useEffect, useState } from 'react';
import './Chatbox.css';
import assests from '../../assets/assests.js';
import { AppContext } from '../../Context/AppContext.jsx';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../Config/firebase.js';
import { toast } from 'react-toastify';
import  upload  from '../lib/upload'
const Chatbox = () => {
  const { userData, messageId, chatuser, messages, setMessages,chatVisible,setChatVisible,rightVisible,setRightVisible } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input.trim() && messageId) {
        // Update messages collection
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });
  
        const userIDs = [chatuser.rId, userData.id];
  
        for (const id of userIDs) {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatRef);
  
          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
  
            if (!userChatData.chatsData) {
              userChatData.chatsData = [];
            }
  
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );
  
            if (chatIndex !== -1) {
              userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatsData[chatIndex].updateAt = Date.now();
  
              // Only set messageSeen to false for the other user
              if (userChatData.chatsData[chatIndex].rId !== userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
  
              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData,
              });
            } else {
              userChatData.chatsData.push({
                messageId,
                lastMessage: input.slice(0, 30),
                updateAt: Date.now(),
                rId: chatuser.rId,
                messageSeen: id === userData.id,  // Set seen for self, not for recipient
              });
  
              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };
  
  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });
        const userIDs = [chatuser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();

            // Ensure chatsData exists
            if (!userChatData.chatsData) {
              userChatData.chatsData = [];
            }

            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );

            if (chatIndex !== -1) {
              userChatData.chatsData[chatIndex].lastMessage = "image";
              userChatData.chatsData[chatIndex].updateAt = Date.now();

              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }

              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData,
              });
            } else {
              userChatData.chatsData.push({
                messageId,
                lastMessage: input.slice(0, 30),
                updateAt: Date.now(),
                rId: chatuser.rId,
                messageSeen: false,
              });

              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        });
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM"
    } else {
      return hour + ":" + minute + "AM"
    }
  }
  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        const fetchedMessages = res.data()?.messages || [];
        setMessages(fetchedMessages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messageId]);

  return chatuser ? (
    <div className={`chat-box ${chatVisible?"":"hidden"} ${rightVisible?"hidden":""}`}>
      <div className="chat-user">
        <img src={chatuser.userData.avatar} alt="profile" className='profilem' />
        <p>{chatuser.userData.name}{Date.now()-chatuser.userData.lastSeen<=7000?<img src={assests.dot} alt="active" />:""}</p>
        <img src={assests.help} alt="help" className='help' />
        <img onClick={()=>setChatVisible(false)} src={assests.arrow} alt="arrow" className='arrow' />
        <img onClick={()=>setRightVisible(true)} src={assests.menu1} alt="menu" className='menu' />
      </div>
      <div className="chat-mssg">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "s-mssg" : "r-mssg"}>
            {msg["image"]
              ? <img className='msg-img' src={msg.image} alt="img" />
              : <p className="msg">{msg.text}</p>

            }
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatuser.userData.avatar} alt="profile" />
              {console.log(chatuser.userData.avatar,"reciever")}
              {console.log(userData.avatar,"sender")}
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className="send-a-message" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png,image/jpeg,image/jpg' hidden />
        <label htmlFor="image">
          <img src={assests.gallery} alt="gallery" />
        </label>
        <img onClick={sendMessage} src={assests.send} alt="sent" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible?"":"hidden"}`}>
      <img src={assests.logo} alt="logo" />
      <p>Chat as you want!!</p>
    </div>
  );
};

export default Chatbox;
