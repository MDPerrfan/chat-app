import React from 'react'
import './RightSidebar.css'
import assests from '../../assets/assests'
import { logout } from '../../Config/firebase'
const RightSidebar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assests.profile} alt="profile" />
        <h3>Richard Ray <img src={assests.dot} alt="d" className='dot' /></h3>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assests.profile} alt="" />
          <img src={assests.profile} alt="" />
          <img src={assests.profile} alt="" />
          <img src={assests.profile} alt="" />
          <img src={assests.profile} alt="" />
          <img src={assests.profile} alt="" />
        </div>
      </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default RightSidebar
