// src/Home.js
import React from 'react';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Welcome</h1>
        <p>You are logged in.</p>
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>
      </section>
    </Layout>
  );
};

export default Home;
