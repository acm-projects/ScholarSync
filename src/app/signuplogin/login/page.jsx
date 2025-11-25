'use client';

import { useState } from 'react';
import Link from 'next/link';
import './login.css';
import Image from 'next/image';

const Login = () => {
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');

  const handle = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://eckapa4iqi.execute-api.us-east-2.amazonaws.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Login failed');
        return;
      }

      alert('Login successful!');

      // Add username to memory
      window.localStorage.setItem("username", username);

      // Optionally redirect after login
      window.location.href = '/dashboard'; // replace with your logged-in route
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Error connecting to backend');
    }
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
                    <input type="email" placeholder="Username"  value={username} onChange={(e) => setusername(e.target.value)}/>
                </div>
                
                <div className="input">
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className = "forgot">
                <span>Forgot Password? </span>
                </div>
                      
                <div className= "Login-submit-container">
                  <Link href="/homeresearchpage">
                    <button className = "submit" type = "submit">
                      Login
                    </button>
                </Link>
                </div>

                </div>

                </form>

                <div className = "account">
                Don't have an account? 
                <Link href = "/signuplogin/signup">
                <span className="signup-link">Signup</span>
                </Link>
                </div>
        

                <div className = "divide">        
          
                </div>

          </div>
        </div>
      );
    }
  
export default Login;