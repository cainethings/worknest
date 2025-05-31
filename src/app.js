// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import config from './config.json';
import './library/styles/main.scss';

import Login from './pages/account';
import Manual from './pages/account/manual';
import Home from './pages/home';
import NotFound from './pages/errors/notFound';

const App = () => {
  return (
    <Router>
      {config.environment === 'under-construction' ? (
        <Routes>
          <Route path="*" element={<UnderConstruction />} /> {/* Display UnderConstruction for all routes */}
        </Routes>
      ) : (
        <Routes>
          {/* Regular routes */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/manual" element={<Manual />} />          
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
