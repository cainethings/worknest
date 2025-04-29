// src/About.js
import React from 'react';
import './primary.scss';

import globalContent from '../../contents/global.json';

const PrimaryHeader = () => {
	return (
		<header>
			<div className='branding-col'>
				<p className='content-heading'>WorkNest<span>by CaineThings</span></p>
			</div>
			<div className='nav-col'>
				{/* <p>Work Nest</p> */}
			</div>
		</header>
	);
};

export default PrimaryHeader;
