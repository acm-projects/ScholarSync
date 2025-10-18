'use client';

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