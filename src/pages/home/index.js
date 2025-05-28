// src/Home.js
import React, { useState, useRef } from 'react';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';
import html2pdf from 'html2pdf.js';

import HiddenData from './table.js';



const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipData, setPayslipData] = useState(null);
  const payslipRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('otp');
    window.location.href = '/';
  };



  const handleDownload = async () => {
    if (!selectedMonth) {
      alert('Please select a month first.');
      return;
    }

    const phoneNumber = localStorage.getItem('userPhone');
    if (!phoneNumber) {
      alert('User phone number not found.');
      return;
    }

    try {
      const response = await fetch(`https://your-server.com/api/payslip.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, month: selectedMonth })
      });

      if (!response.ok) throw new Error('Server error while fetching payslip.');

      const data = await response.json();
      setPayslipData({
        name: data.name,
        phone: phoneNumber,
        month: selectedMonth,
        designation: data.designation,
        components: [
          ['Salary', data.salary],
          ['Deductions', data.deductions],
          ['Net Pay', data.netPay],
        ]
      });

      // Wait for state to update and DOM to render
      setTimeout(() => {
        html2pdf().set({
          margin: 0.5,
          filename: `Payslip-${selectedMonth.replace(/\s+/g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).from(payslipRef.current).save();
      }, 100);
    } catch (error) {
      alert('Failed to download payslip: ' + error.message);
    }
  };

  const handleTestDownload = () => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    fetch('http://localhost:8888/getPayslip.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        month: selectedMonth,
        phone: phoneNumber,

      }),
    })
      .then(async (response) => {
        const data = await response.json(); // or response.text() depending on the API
        const paySlipDataMain = data.data;
        setPayslipData(paySlipDataMain);
        console.log('here')
        setTimeout(() => {
          html2pdf().set({
            margin: 1,
            filename: `Payslip-April-2025.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
          }).from(payslipRef.current).save();
        }, 100);
      }).catch((error) => {
        console.error('Fetch error:', error);
      });
  };

  const getMonthsFromStart = () => {
    const startMonth = 3; // April (0-indexed)
    const startYear = 2025;

    const now = new Date();
    const months = [];

    // Target is last completed month
    let endMonth = now.getMonth() - 1;
    let endYear = now.getFullYear();

    if (endMonth < 0) {
      endMonth = 11;
      endYear -= 1;
    }

    let currentMonth = startMonth;
    let currentYear = startYear;

    while (
      currentYear < endYear ||
      (currentYear === endYear && currentMonth <= endMonth)
    ) {
      const date = new Date(currentYear, currentMonth, 1);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = String(currentYear).slice(-2);
      months.push(`${month}-${year}`);

      // Increment month and year
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    return months;
  };

  return (
    <Layout pageContent={pageContent}>
      <section className='hero'>
        <h1 className='section-title'>Hello!</h1>
        <p className='instruction'>Select the month you want to download your payslip for.</p>

        <div className='dropdown-container'>
          <select
            className='month-dropdown'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value=''>-- Select Month --</option>
            {getMonthsFromStart().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {/* 
          <button className='download-button' onClick={handleDownload}>
            Download Payslip
          </button> */}
          <button className='download-button' onClick={handleTestDownload}>
            Download PDF
          </button>
        </div>
        <br /><br /><br /><br /><br />
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>

        {/* Hidden Payslip HTML for PDF generation */}
        {payslipData && (
          <div style={{ display: 'none' }}>
            <div ref={payslipRef} className='payslip-preview'>
              <HiddenData payslipData={payslipData} selectedMonth={selectedMonth} />
              <p style={{ marginTop: "30px" }}><b>Note:</b> This is system generated payslip and does not require signature</p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
