'use client';

//import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import Link from 'next/link';
=======
import Link from "next/link";
>>>>>>> 6ea6310fb0c022e45ba34049e048431cd74fea46
import { useState } from 'react';

import './signup.css';
import Image from 'next/image';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handle = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('https://eckapa4iqi.execute-api.us-east-2.amazonaws.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Signup failed');
        return;
      }

      alert('Signup successful! Please check your email to confirm.');
      window.location.href = '/signuplogin/login';
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Error connecting to backend');
    }
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
                    <input type="Username" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}/>
                </div>
                <div className="input">
                <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="input">
                    <input type= "password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                
                
                <div className= "Sign-submit-container">
                  <Link href="/onboarding/onboarding1">
                    <button className = "submit" type = "submit" href="/onboarding/onboarding1">
                      Sign up
                    </button>
                  </Link>

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
  
<<<<<<< HEAD
export default Signup;
=======
  export default Signup;
  

>>>>>>> 6ea6310fb0c022e45ba34049e048431cd74fea46
