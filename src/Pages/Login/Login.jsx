import React, { useState } from 'react'
import "./Login.css"
import assests from '../../assets/assests'
import {login, signUp} from "../../Config/firebase"
const Login = () => {
    const [curr, setCurrent] = useState("Sign Up");
    const [userName,setuserName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(curr==="Sign Up"){
            signUp(userName,email,password);
        }else{
            login(email,password);
        }
    }
    return (
        <div className='login'>
            <img className='logo' src={assests.logo} alt="logo" />
            <form onSubmit={(e)=>onSubmitHandler(e)} className="login-form">
                <h2>{curr}</h2>
                {curr === "Sign Up" ? <input onChange={(e)=>setuserName(e.target.value)} value={userName} className='form-input' type="text" placeholder='User Name' /> : ""}
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='form-input' type="email" placeholder='Email' />
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='form-input' type="password" placeholder='Password' />
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
