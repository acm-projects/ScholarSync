import styles from './Login.module.css';
import Image from 'next/image';

const Login = () => {
  return (
    <div>
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