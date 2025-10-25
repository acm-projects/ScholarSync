'use client';

<<<<<<< HEAD
//import { useRouter } from 'next/navigation';
import Link from 'next/Link';
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
