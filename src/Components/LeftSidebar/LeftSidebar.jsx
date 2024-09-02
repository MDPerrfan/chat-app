import React from 'react'
import './LeftSidebar.css'
import assests from '../../assets/assests'
const LeftSidebar = () => {
    return (
        <div className='ls'>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assests.mssg} alt="logo" className='logo' />
                    <div className="menu">
                        <img src={assests.menu} alt="menu" />
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assests.search} alt="search"style={{maxWidth:"25px"}} />
                    <input type="text" placeholder='search here' />
                </div>
                <div className="ls-list">
                    {Array(12).fill("").map((item,index)=>(
                    <div key={index} className="friends">
                        <img src={assests.profile} alt="avatar"/>
                        <div>
                            <p>Richard</p>
                            <span>Hello,How are you?</span>
                        </div>
                    </div>
                    ))}           
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar
