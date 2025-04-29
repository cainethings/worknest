// src/Home.js
import React from 'react';
import Layout from '../../layouts/primary'
import './home.scss';
import pageContent from './content.json';

const Home = () => {
  return (
    <Layout pageContent={pageContent}>
      Hello
    </Layout>
  );
};

export default Home;
