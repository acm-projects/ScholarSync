'use client';

//import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useState } from 'react';

import './signup.css';
import Image from 'next/image';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState();

  const handle = (e) =>{
    e.preventDefault();

    const Using = {
      email, username, password,
    };

  };

    return (
        <div>
          <div className="container">
          <div className="Header">
              <div className="text">Signup</div>
            </div>
            <form onSubmit = {handle}>
            <div className="inputs">
                <div className="input">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}/>
                </div>
                <div className="input">
                <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="input">
                    <input type= "password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                
                
                <div className= "Sign-submit-container">
                <button className = "submit" type = "submit">
                    Sign up
                </button>

                </div>
                </div>
                </form>

                <div className = "account">
                Already have an account? 
                <Link href="/signuplogin/login">
                <span className="login-link">Login</span>
                </Link>
                </div>

                <div className = "divide">        
            
                </div>

          </div>
        </div>


      );
    }
  
  export default Signup;
  

