// src/Footer.js
import React from 'react';
import './primary.scss';

import globalContent from '../../contents/global.json';

const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('otp');
    window.location.href = '/';
};

const PrimaryFooter = () => {
    return (
        <footer>
            <button onClick={handleLogout} className='logout-button'>
                Logout
            </button>
            <p>
                Version: {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}-{typeof __BUILD_DATE__ !== 'undefined' ? new Date(__BUILD_DATE__).toLocaleString() : 'now'}
            </p>
        </footer>
    );
};

export default PrimaryFooter;
