// src/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';
import html2pdf from 'html2pdf.js';

import HiddenData from './table.js';



const Home = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipData, setPayslipData] = useState(null);
  const [months, setMonths] = useState([]);
  const [error, setError] = useState(null);
  const payslipRef = useRef();


  const getApiBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:8888';
    } else {
      return 'https://api-worknest.cainethings.com';
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (!token) {
      navigate('/');
      return;
    }

    const phoneNumber = localStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      setError('Phone number not found in localStorage');
      return;
    }

    const getList = `${getApiBaseUrl()}/getAvailableMonths.php`;
    const fetchMonths = async () => {
      try {
        const response = await fetch(getList, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: phoneNumber }),
        });
        const data = await response.json();

        if (data.success) {
          setMonths(data.files);
        } else {
          setError(data.message || 'No records found for this phone number');
          setMonths([]);
        }
      } catch (err) {
        setError('Error fetching months: ' + err.message);
        setMonths([]);
      }
    };

    fetchMonths();
  }, [navigate]);

  const handleDownload = () => {
    const getPaySlip = `${getApiBaseUrl()}/getPayslip.php`;
    const phoneNumber = localStorage.getItem('phoneNumber');
    fetch(getPaySlip, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        month: selectedMonth,
        phone: phoneNumber,
      }),
    }).then(async (response) => {
      const data = await response.json();
      const paySlipDataMain = data.data;
      setPayslipData(paySlipDataMain);
      setTimeout(() => {
        if (!data.success) {
          alert('Error: ' + data.message);
        }
        html2pdf().set({
          margin: 1,
          filename: `Payslip-April-2025.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).from(payslipRef.current).save().then(() => {
          alert('Download completed successfully!');
        });
      }, 100);
    }).catch((error) => {
      console.error('Fetch error:', error);
    });
  };

  const getMonthsFromStart = () => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    fetch('https://api-worknest.cainethings.com/getPayslip.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        month: selectedMonth,
        phone: phoneNumber,
      }),
    }).then(async (response) => {
      const data = await response.json();
      const paySlipDataMain = data.data;
      setPayslipData(paySlipDataMain);
      setTimeout(() => {
        if (!data.success) {
          alert('Error: ' + data.message);
        }
        html2pdf().set({
          margin: 1,
          filename: `Payslip-April-2025.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).from(payslipRef.current).save().then(() => {
          alert('Download completed successfully!');
        });
      }, 100);
    }).catch((error) => {
      console.error('Fetch error:', error);
    });
    const startMonth = 0; // April (0-indexed)
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
            {months.map((fileName) => {
              // Extract the month-year part from the filename by removing '.csv'
              const monthLabel = fileName.replace('.csv', '');
              return (
                <option key={fileName} value={monthLabel}>
                  {monthLabel}
                </option>
              );
            })}
          </select>
          {/* 
          <button className='download-button' onClick={handleDownload}>
            Download Payslip
          </button> */}
          <button className='download-button' onClick={handleDownload}>
            Download PDF
          </button>
        </div>
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
