import React, { useState } from 'react'
import "./Login.css"
import assests from '../../assets/assests'
const Login = () => {
    const [curr, setCurrent] = useState("Sign Up");
    const handleOnclick = () => {

    }
    return (
        <div className='login'>
            <img className='logo' src={assests.logo} alt="logo" />
            <form className="login-form">
                <h2>{curr}</h2>
                {curr === "Sign Up" ? <input className='form-input' type="text" placeholder='User Name' /> : ""}
                <input className='form-input' type="email" placeholder='Email' />
                <input className='form-input' type="password" placeholder='Password' />
                <button type='submit'>{curr==="Login"?'Login':'Sign Up'}</button>
                <div className="login-term">
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>
                <div className="login-forgot">
                    <div className="login-toggle">
                    {curr === "Login" ? <p>Create a new account? <span onClick={() => setCurrent("Sign Up")}>Click here</span></p>
                        : <p>Already have an account? <span onClick={() => setCurrent("Login")}>Login here</span></p>
                    }
                    </div>
                   
                </div>
            </form>
        </div>
    )
}

export default Login