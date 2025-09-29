'use client';

import styles from './Signup.module.css';
import Image from 'next/image';

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
            <Image
              src="/Separator.png"
              alt="or"
              width={280}
              height={20}
            />
          </div>

          <div className={styles['CG-submit-container']}>
            <Image
              src="/google.png"
              alt="Google icon"
              width={21}
              height={21}
            />
            <div className={styles.submit}>Continue with Google</div>
          </div>

          <div className={styles['CL-submit-container']}>
            <Image
              src="/LinkedIn.png"
              alt="LinkedIn icon"
              width={21}
              height={21}
            />
            <div className={styles.submit}>Continue with LinkedIn</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
