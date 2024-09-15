import React, { useContext, useEffect, useState } from 'react'
import './RightSidebar.css'
import assests from '../../assets/assests'
import { logout } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'
const RightSidebar = () => {
  const {chatuser,messages}=useContext(AppContext);
  const [mssgImages,setMssgimages]=useState([])
  useEffect(()=>{
    let temp = [];
    messages.map((mssg)=>{
      if(mssg.image){
        temp.push(mssg.image)
      }
    })
    setMssgimages(temp)
  },[messages])

  return chatuser? (
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatuser.userData.avatar} alt="profile" />
        <h3>{chatuser.userData.name}{Date.now()-chatuser.userData.lastSeen<=7000?<img src={assests.dot} className='dot' alt="active" />:""}</h3>
        <p>{chatuser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {mssgImages.map((url,index)=>(
             <img onClick={()=>window.open(url)} src={url} key={index} alt="pics" />
          ))}
        </div>
      </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  ): (
    <div className='rs'>
      <button onClick={()=>logout}>Logout</button>
    </div>
  )
}

export default RightSidebar
