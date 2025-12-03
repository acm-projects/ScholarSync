'use client';

import { useState } from 'react';
import Link from 'next/link';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Login failed');
        return;
      }

      // Store username in lowercase to match DynamoDB (Cognito stores usernames in lowercase)
      window.localStorage.setItem("username", username.toLowerCase());
      console.log("Username:", username.toLowerCase());

      alert('Login successful!');

      // Redirect to professor page after login
      window.location.href = '/professorpage';
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Error connecting to backend');
    }
  };

  return (
    <div className="container">
      <div className="Header">
        <div className="text">Login</div>
      </div>

      <form onSubmit={handle}>
        <div className="inputs">
          <div className="input">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot">
            <span>Forgot Password?</span>
          </div>

          <div className="Login-submit-container">
            <button className="submit" type="submit">
              Login
            </button>
          </div>
        </div>
      </form>

      <div className="account">
        Don't have an account?{' '}
        <Link href="/signuplogin/signup">
          <span className="signup-link">Signup</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;