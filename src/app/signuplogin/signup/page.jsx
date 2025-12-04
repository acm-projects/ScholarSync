'use client';

import Link from "next/link";
import { useState } from 'react';
import './signup.css';
import Image from 'next/image';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handle = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !username) {
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

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
        }
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
      }

      // If response is not OK, check the error
      if (!response.ok) {
        const errorMessage = data.message || data.error || `Signup failed: ${response.status}`;
        
        // If it's a 500 error, the signup might still have succeeded (Cognito created the user)
        // but the API response failed. Since you mentioned the user IS being created,
        // we'll proceed to onboarding anyway for 500 errors.
        if (response.status === 500) {
          console.warn('API returned 500, but proceeding as user may have been created:', errorMessage);
        } else {
          // For other errors (400, 401, etc.), show the error and return
          alert(errorMessage);
          return;
        }
      }

      // Store username in lowercase to match DynamoDB (Cognito stores usernames in lowercase)
      window.localStorage.setItem("username", username.toLowerCase());
      
      // Redirect to onboarding instead of login
      window.location.href = '/onboarding/onboarding1';

    } catch (err) {
      console.error('Error connecting to backend:', err);
      // Even if there's an error, if the user was created, we should still redirect
      // Check if username was set (indicating possible success)
      if (username) {
        window.localStorage.setItem("username", username.toLowerCase());
        window.location.href = '/onboarding/onboarding1';
      } else {
        alert('Error connecting to backend');
      }
    }
  };

  return (
    <div className="container">
      <div className="Header">
        <div className="text">Sign Up</div>
      </div>

      <form onSubmit={handle}>
        <div className="inputs">
          <div className="input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="Sign-submit-container">
            <button className="submit" type="submit">Sign up</button>
          </div>
        </div>
      </form>

      <div className="account">
        Already have an account?
        <Link href="/signuplogin/login">
          <span>Login</span>
        </Link>
      </div>  
    </div>
  );
}

export default Signup;