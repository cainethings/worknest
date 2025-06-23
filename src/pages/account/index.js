import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';
import { getApiBaseUrl } from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

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
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      alert('PIN must be exactly 4 digits.');
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
          pin: pin,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem('isLoggedIn', true);
        // Store the phone number returned by the API to ensure accuracy
        localStorage.setItem(
          'phoneNumber',
          result.user?.phone_number || phoneNumber
        );
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
        <p className='instruction'>Enter your phone number and 4‑digit PIN to login.</p>
        <form onSubmit={handleLogin}>
          <div className='custom-field'>
            <p className='field-label'>Phone Number</p>
            <input
              type='tel'
              name='phoneNumber'
              placeholder='Enter phone number'
              maxLength='10'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ''))}
            />
          </div>
          <div className='custom-field'>
            <p className='field-label'>PIN</p>
            <input
              type='password'
              name='pin'
              placeholder='Enter 4-digit PIN'
              maxLength='4'
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/, ''))}
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
