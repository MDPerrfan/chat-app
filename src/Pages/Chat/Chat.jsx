import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import RightSidebar from '../../Components/RightSidebar/RightSidebar'
import Chatbox from '../../Components/Chatbox/Chatbox'
import LeftSidebar from '../../Components/LeftSidebar/LeftSidebar'
import { AppContext } from '../../Context/AppContext'
const Chat = () => {
  const { chatsData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(chatsData && userData){
      setLoading(false);
    }
  },[chatsData,userData])
  return (
    <div className='chat'>
      {loading ?
        <p>Loading...</p>
        :
        <div className="chat-container">
          <LeftSidebar />
          <Chatbox />
          <RightSidebar />
        </div>
      }

    </div>
  )
}

export default Chat
