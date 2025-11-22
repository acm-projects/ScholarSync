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

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(
        'https://eckapa4iqi.execute-api.us-east-2.amazonaws.com/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Signup failed');
        return;
      }

      alert('Signup successful!');

      localStorage.setItem("username", username);

      // Navigate to next onboarding page only AFTER Lambda succeeds
      window.location.href = '/onboarding/onboarding1';
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
              <button className="submit" type="submit">
                Sign up
              </button>
            </div>
          </div>
        </form>

        <div className="account">
          Already have an account?
          <Link href="/signuplogin/login">
            <span className="login-link">Login</span>
          </Link>
        </div>

        <div className="divide"></div>
      </div>
    </div>
  );
};

export default Signup;