// src/Home.js
import React from 'react';
import Layout from '../../layouts/primary'
import './home.scss';
import pageContent from './content.json';

const Home = () => {
  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Login</h1>
        <p className='instruction'>Enter your registered phone number to login.</p>
        <form>
          <div className='custom-field'>
            <p className='field-label'>Phone Number</p>
            <input type='number' name='phoneNumber' placeholder='9876543210' maxlength='10' />
          </div>
          <button>Login</button>
        </form>
        <p className='disclaimer'>You don’t need a password to log in. Enter your registered phone number, and we’ll send you a one-time OTP for secure access.</p><p className='disclaimer'>Please note: The number you use must already be registered in our office records.</p>
      </section>
    </Layout>
  );
};

export default Home;
