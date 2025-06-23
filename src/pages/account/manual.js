import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';

const SHA256_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'; // hash for "1234"

const ManualLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');

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

    const hashedInput = await hashPassword(pin);

    if (hashedInput !== SHA256_HASH) {
      alert('Incorrect PIN. Access denied.');
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
        <p className='instruction'>Enter a phone number and admin PIN to login manually.</p>

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
            <p className='field-label'>Admin PIN</p>
            <input
              type='password'
              name='pin'
              placeholder='1234'
              maxLength='4'
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/, ''))}
            />
          </div>

          <button type='submit'>Login (Test)</button>
        </form>

        <p className='disclaimer warning'>
          ⚠️ This manual login is protected by a static PIN. For testing use only.
        </p>
      </section>
    </Layout>
  );
};

export default ManualLogin;
