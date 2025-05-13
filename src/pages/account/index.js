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

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      // Simulate OTP sending
      localStorage.setItem('phoneNumber', phoneNumber);
      localStorage.setItem('otp', 918273);
      console.log(`OTP sent to ${phoneNumber}`);
      setOtpSent(true);
    } else {
      alert('Enter a valid 10-digit phone number.');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpSession = localStorage.getItem('otp');
    if (otp.length === 6 && otpSession === otp) {
      // Simulate successful login
      localStorage.setItem('isLoggedIn', true);
      navigate('/home');
    } else {
      alert('Enter a valid 6-digit OTP.');
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
              <button type='submit'>Get OTP</button>
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
