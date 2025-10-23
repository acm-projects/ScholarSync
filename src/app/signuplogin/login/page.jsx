'use client';
import { useState } from 'react';
import Link from 'next/link';
import './login.css';
import Image from 'next/image';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');

  const handle = (e) =>{
    e.preventDefault();

    const UsingL = {
      email, password,
    };
  };
    return (
        <div>
          <div className="container">
          <div className="Header">
              <div className="text">Login</div>
            </div>

            <form onSubmit = {handle}>
            
            <div className="inputs">
                <div className="input">
                    <input type="email" placeholder="Email or Username"  value={email||username} onChange={(e) => {setEmail(e.target.value);setusername(e.target.value)}}/>
                </div>
                
                <div className="input">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className = "forgot">
                <span>Forgot Password? </span>
                </div>
                      
                <div className= "Login-submit-container">
                <button className = "submit" type = "submit">
                    Login
                </button>
                </div>

                </div>

                </form>

                <div className = "account">
                Don't have an account? 
                <Link href = "/signuplogin/signup">
                <span>Signup</span>
                </Link>
                </div>
        

                <div className = "divide">        
                <Image
                src="/Separator.png"
                alt="or"
                width={280}
                height={20}/>
                </div>
                
                <div className= "CG-submit-container">
                <Image
                src="/google.png"
                alt="icon"
                width={21}
                height={21}/>
                <div className = "submit">
                Login with Google
                </div>
                </div>

                <div className= "CL-submit-container">
                <Image
                src="/LinkedIn.png"
                alt="icon"
                width={21}
                height={21}/>

                <div className = "submit">
                Login with LinkedIn
                </div>
                </div>

          </div>
        </div>


      );
    }
  
  export default Login;
  