// src/About.js
import React from 'react';
import './primary.scss'
import Header from '../components/headers/primary';
import Footer from '../components/footers/primary';

const PrimaryLayout = (props) => {    
    return (
        <div 
            className='the-layout'
            id={props.pageContent?.meta?.pageID || "common-id"}
        >
            <Header />
            <div className='page-content'>
                {
                    props.children
                }
            </div>
            <Footer />
        </div>
    );
};

export default PrimaryLayout;
