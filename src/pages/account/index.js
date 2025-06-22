import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';
import { getApiBaseUrl } from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (token) navigate('/home');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }
    if (!password) {
      alert('Password cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          phone: phoneNumber,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('phoneNumber', phoneNumber);
        navigate('/home');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Unable to login at the moment. Try again later.');
    }
  };

  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Login</h1>
        <p className='instruction'>Enter your phone number and password to login.</p>
        <form onSubmit={handleLogin}>
          <div className='custom-field'>
            <p className='field-label'>Phone Number</p>
            <input
              type='tel'
              name='phoneNumber'
              placeholder='9876543210'
              maxLength='10'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ''))}
            />
          </div>
          <div className='custom-field'>
            <p className='field-label'>Password</p>
            <input
              type='password'
              name='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit'>Login</button>
        </form>
        <p className='disclaimer'>
          Don't have an account? <a href='/register'>Register</a>
        </p>
      </section>
    </Layout>
  );
};

export default Login;
