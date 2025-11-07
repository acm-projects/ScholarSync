<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
'use client';
import { useState } from 'react';
import Link from 'next/link';
import './login.css';
import Image from 'next/image';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');

<<<<<<< HEAD
  const handle = async (e) => {
    e.preventDefault();

    if (!email || !password) {
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
      // Optionally redirect after login
      window.location.href = '/dashboard'; // replace with your logged-in route
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Error connecting to backend');
    }
=======
  const handle = (e) =>{
    e.preventDefault();

    const UsingL = {
      email, password,
    };
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
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
<<<<<<< HEAD
  
=======
  
=======
import styles from './login.module.css';
import Image from 'next/image';

const Login = () => {
  return (
    <div >
      <div className={styles.container}>
        <div className={styles.Header}>
          <div className={styles.text}>Login</div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.input}>
            <input type="email" placeholder="Email" />
          </div>
          <div className={styles.input}>
            <input type="password" placeholder="Create Password" />
          </div>

          <div className={styles.forgot}>
            <span>Forgot Password? </span>
          </div>

          <div className={styles['Login-submit-container']}>
            <div className={styles.submit}>Login</div>
          </div>

          <div className={styles.account}>
            Don't have an account? <span>Signup</span>
          </div>

          <div className={styles.divide}>
            <Image
              src="/Separator.png"
              alt="or"
              width={280}
              height={20}
            />
          </div>

          <div className={styles['CG-submit-container']}>
            <Image src="/google.png" alt="icon" width={21} height={21} />
            <div className={styles.submit}>Login with Google</div>
          </div>

          <div className={styles['CL-submit-container']}>
            <Image src="/LinkedIn.png" alt="icon" width={21} height={21} />
            <div className={styles.submit}>Login with LinkedIn</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
