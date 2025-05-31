import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';

const SHA256_HASH = '8cceec2c501bb9f97584fa5b9f5b3bd5f7aef4985dade3827736f00d7c448b90'; // hash for "iamadmin123"

const ManualLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (token) navigate('/home');
  }, [navigate]);

  const hashPassword = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }

    const hashedInput = await hashPassword(password);

    if (hashedInput !== SHA256_HASH) {
      alert('Incorrect password. Access denied.');
      return;
    }

    // Simulate successful login
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('phoneNumber', phoneNumber);

    console.log(`Manually logged in as: ${phoneNumber}`);
    navigate('/home');
  };

  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Manual Login (Testing)</h1>
        <p className='instruction'>Enter a phone number and admin password to login manually.</p>

        <form onSubmit={handleManualLogin}>
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
            <p className='field-label'>Admin Password</p>
            <input
              type='password'
              name='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type='submit'>Login (Test)</button>
        </form>

        <p className='disclaimer warning'>
          ⚠️ This manual login is protected by a static password. For testing use only.
        </p>
      </section>
    </Layout>
  );
};

export default ManualLogin;
