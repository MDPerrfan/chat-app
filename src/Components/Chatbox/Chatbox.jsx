import React from 'react'
import './Chatbox.css'
import assests from '../../assets/assests.js'
const Chatbox = () => {
  return (
    <div className='chat-box'>
      <div className="chat-user">
        <img src={assests.profile} alt="profile" className='profile' />
        <p>Richard <img src={assests.dot} alt="active" /></p>
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
        <input type="text" className="send-a-message" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png,image/jpeg,image/jpg' hidden />
        <label htmlFor="image">
          <img src={assests.gallery} alt="gallery" />
        </label>
        <img src={assests.send} alt="sent" />
      </div>

    </div>
  )
}

export default Chatbox
