// src/Home.js
import React, { useState } from 'react';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';
import jsPDF from 'jspdf';

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/'; // Redirect to login page
  };

  const handleDownload = async () => {
    if (!selectedMonth) {
      alert('Please select a month first.');
      return;
    }

    const phoneNumber = localStorage.getItem('userPhone'); // Set this at login
    if (!phoneNumber) {
      alert('User phone number not found.');
      return;
    }

    try {
      const response = await fetch(`https://your-server.com/api/payslip.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, month: selectedMonth })
      });

      if (!response.ok) {
        throw new Error('Server error while fetching payslip.');
      }

      const payslipData = await response.json();

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Payslip - ${selectedMonth}`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${payslipData.name}`, 20, 40);
      doc.text(`Phone: ${phoneNumber}`, 20, 50);
      doc.text(`Designation: ${payslipData.designation}`, 20, 60);
      doc.text(`Salary: ₹${payslipData.salary}`, 20, 70);
      doc.text(`Deductions: ₹${payslipData.deductions}`, 20, 80);
      doc.text(`Net Pay: ₹${payslipData.netPay}`, 20, 90);
      doc.save(`Payslip-${selectedMonth.replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      alert('Failed to download payslip: ' + error.message);
    }
  };

  const handleTestDownload = () => {
    const doc = new jsPDF();
  
    // Dummy values
    const dummyMonth = 'April 2025';
    const dummyName = 'Caine Daniel';
    const dummyPhone = '9876543210';
    const dummyDesignation = 'Developer';
    const dummySalary = 60000;
    const dummyDeductions = 8000;
    const dummyNetPay = 52000;
  
    // Build PDF content
    doc.setFontSize(16);
    doc.text(`Payslip - ${dummyMonth}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${dummyName}`, 20, 40);
    doc.text(`Phone: ${dummyPhone}`, 20, 50);
    doc.text(`Designation: ${dummyDesignation}`, 20, 60);
    doc.text(`Salary: ₹${dummySalary}`, 20, 70);
    doc.text(`Deductions: ₹${dummyDeductions}`, 20, 80);
    doc.text(`Net Pay: ₹${dummyNetPay}`, 20, 90);
  
    // Generate as blob and open in new tab
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
  
    // Open in new tab (works on most mobile and desktop browsers)
    const newWindow = window.open(blobUrl, '_blank');
  
    // Fallback if pop-up blocked: force download
    if (!newWindow) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `Payslip-${dummyMonth.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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

        {/* Uncomment if logout needed */}
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>
      </section>
    </Layout>
  );
};

export default Home;
