// src/Home.js
import React, { useState, useRef } from 'react';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';
import html2pdf from 'html2pdf.js';

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipData, setPayslipData] = useState(null);
  const payslipRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
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
          ['Deductions', -data.deductions],
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
    setPayslipData({
      name: 'Caine Daniel',
      phone: '9876543210',
      month: 'April 2025',
      designation: 'Developer',
      components: [
        ['Basic Salary', 450000],
        ['HRA', 10000],
        ['Bonus', 10000],
        ['Deductions', -8000],
        ['Net Pay', 52000],
      ]
    });

    setTimeout(() => {
      html2pdf().set({
        margin: 0.5,
        filename: `Payslip-April-2025.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(payslipRef.current).save();
    }, 100);
  };

  const getLast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.push(month);
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
            {getLast12Months().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <button className='download-button' onClick={handleDownload}>
            Download Payslip
          </button>
          <button className='download-button' onClick={handleTestDownload}>
            Test Download Dummy PDF
          </button>
        </div>

        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>

        {/* Hidden Payslip HTML for PDF generation */}
        {payslipData && (
          <div style={{ display: 'none' }}>
            <div ref={payslipRef} className='payslip-preview'>
              <h2>Payslip - {payslipData.month}</h2>
              <p><strong>Name:</strong> {payslipData.name}</p>
              <p><strong>Phone:</strong> {payslipData.phone}</p>
              <p><strong>Designation:</strong> {payslipData.designation}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} border='1'>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payslipData.components.map(([label, value], index) => (
                    <tr key={index}>
                      <td>{label}</td>
                      <td>{formatCurrency(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
