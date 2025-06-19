import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './login.scss';
import pageContent from './content.json';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

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

    if (!name || !password) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await fetch('https://api-worknest.cainethings.com/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: name,
          phone: phoneNumber,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Registration successful. Please log in.');
        navigate('/');
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
            <p className='field-label'>Name</p>
            <input
              type='text'
              name='name'
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <p className='field-label'>Password</p>
            <input
              type='password'
              name='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
