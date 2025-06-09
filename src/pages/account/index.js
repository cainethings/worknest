// src/login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (token) navigate('/home');
  }, [navigate]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await fetch('https://api-worknest.cainethings.com/account.php', {      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'send_otp',
          phone: phoneNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('phoneNumber', phoneNumber);
        // Don't store OTP on frontend in production
        // console.log(`OTP sent to ${phoneNumber}: ${result.otp}`);
        localStorage.setItem('isLoggedIn', true);
        navigate('/home');
        // setOtpSent(true);
      } else {
        alert(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error contacting server:', error);
      alert('Server error. Try again later.');
    }
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      alert('Enter a valid 6-digit OTP.');
      return;
    }

    const phoneNumber = localStorage.getItem('phoneNumber');

    try {
      const response = await fetch('https://api-worknest.cainethings.com/account.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'verify_otp',
          phone: phoneNumber,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('isLoggedIn', true);
        navigate('/home');
      } else {
        alert(result.message || 'OTP verification failed');
        navigate('/home');
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Unable to verify OTP at the moment. Try again later.');
    }
  };


  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        {!otpSent ? (
          <>
            <h1 className='section-title'>Login</h1>
            <p className='instruction'>Enter your registered phone number to login.</p>
            <form onSubmit={handlePhoneSubmit}>
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
              <button type='submit'>Login</button>
            </form>
          </>
        ) : (
          <>
            <h1 className='section-title'>One Time Password</h1>
            <p className='instruction'>Enter the OTP that you would have received in you registered phone number.</p>
            <form onSubmit={handleOtpSubmit}>
              <div className='custom-field'>
                <p className='field-label'>OTP</p>
                <input
                  type='number'
                  name='otp'
                  placeholder='Enter 6-digit OTP'
                  maxLength='6'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ''))}
                />
              </div>
              <button type='submit'>Login</button>
            </form>
          </>
        )}

        <p className='disclaimer'>You don't need a password to log in. Enter your registered phone number, and we’ll send you a one-time OTP for secure access.</p>
        <p className='disclaimer'>Please note: The number you use must already be registered in our office records.</p>
      </section>
    </Layout>
  );
};

export default Login;
