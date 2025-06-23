import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';
import { getApiBaseUrl } from '../../api';

const Register = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (token) navigate('/home');
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      alert('Enter a valid 10-digit phone number.');
      return;
    }

    if (
      !employeeId ||
      pin.length !== 4 ||
      !/^\d{4}$/.test(pin) ||
      confirmPin !== pin
    ) {
      alert(
        'All fields are required, PIN must be exactly 4 digits and both PINs must match.'
      );
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          employee_id: employeeId,
          phone: phoneNumber,
          pin: pin,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem(
          'phoneNumber',
          result.user?.phone_number || phoneNumber
        );
        navigate('/home');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Server error:', error);
      alert('Unable to register at the moment. Try again later.');
    }
  };

  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Register</h1>
        <p className='instruction'>Create a new account.</p>
        <form onSubmit={handleRegister}>
          <div className='custom-field'>
            <p className='field-label'>Employee ID</p>
            <input
              type='text'
              name='employeeId'
              placeholder='12345'
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
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
            <p className='field-label'>PIN</p>
            <input
              type='password'
              name='pin'
              placeholder='1234'
              maxLength='4'
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/, ''))}
            />
          </div>
          <div className='custom-field'>
            <p className='field-label'>Confirm PIN</p>
            <input
              type='password'
              name='confirmPin'
              placeholder='1234'
              maxLength='4'
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/, ''))}
            />
          </div>
          <button type='submit'>Register</button>
        </form>
        <p className='disclaimer'>
          Already have an account? <a href='/'>Login</a>
        </p>
      </section>
    </Layout>
  );
};

export default Register;
