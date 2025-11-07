'use client';

<<<<<<< HEAD
//import { useRouter } from 'next/navigation';
import Link from 'next/link';
=======
<<<<<<< HEAD
//import { useRouter } from 'next/navigation';
import Link from 'next/Link';
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
import { useState } from 'react';

import './signup.css';
import Image from 'next/image';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
<<<<<<< HEAD
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
=======
  const [confirmPassword, setConfirmPassword] = useState();

  const handle = (e) =>{
    e.preventDefault();

    const Using = {
      email, username, password,
    };

>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
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
<<<<<<< HEAD
                    <input type="Username" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}/>
=======
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}/>
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
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
                <span>Login</span>
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
                Continue with Google
                </div>
                </div>

                <div className= "CL-submit-container">
                <Image
                src="/LinkedIn.png"
                alt="icon"
                width={21}
                height={21}/>

                <div className = "submit">
                Continue with LinkedIn
                </div>
                </div>

          </div>
        </div>


      );
    }
  
  export default Signup;
  

<<<<<<< HEAD
=======
=======
import styles from './signup.module.css';
// import Image from '@/app/signuplogin/';

const Signup = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.text}>Signup</div>
        </div>

        <div className={styles.inputs}>
          <div className={styles.input}>
            <input type="email" placeholder="Email" />
          </div>
          <div className={styles.input}>
            <input type="password" placeholder="Create Password" />
          </div>
          <div className={styles.input}>
            <input type="password" placeholder="Confirm Password" />
          </div>

          <div className={styles['Sign-submit-container']}>
            <div className={styles.submit}>Sign up</div>
          </div>

          <div className={styles.account}>
            Already have an account? <span>Login</span>
          </div>

           <div className={styles.divide}>
            
          </div>

          <div className={styles['CG-submit-container']}>
            
            <div className={styles.submit}>Continue with Google</div>
          </div>

          <div className={styles['CL-submit-container']}>
            
            <div className={styles.submit}>Continue with LinkedIn</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
