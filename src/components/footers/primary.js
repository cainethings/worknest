// src/About.js
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
    let showLogout = true;
    const token = localStorage.getItem('isLoggedIn');
    if (!token) showLogout = false;
    return (
        <footer>
            {
                showLogout ? (
                    <button onClick={handleLogout} className='logout-button'>
                        Logout
                    </button>
                ) : ""
            }

        </footer>
    );
};

export default PrimaryFooter;
