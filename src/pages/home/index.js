// src/Home.js
import React, { useState, useRef } from 'react';
import Layout from '../../layouts/primary';
import './home.scss';
import pageContent from './content.json';
import html2pdf from 'html2pdf.js';
import banner from '../../assets/images/banner.png';

const formatCurrency = (amount) =>
  `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipData, setPayslipData] = useState({
    "Pay Slip For The Month": "April-25",
    "NAME": "Mr. HARIMAN DAS",
    "Designation": "HELPER",
    "ID": "3003",
    "Basic Rate": 595.00,
    "Days Paid": 21.0,
    "OT Hours": 20.0,
    "D.O.J": "07-Jun-11",
    "UAN": "100161838555",
    "Bank": "SBI",
    "A/c No": "35289566329",
    "IFSC": "",
    "EARNING": {
      "Wages Earned": 12495.00,
      "OT Amount": 2975.00,
      "H Allowance": 7884.00,
      "S Allowance": 1190.00,
      "Bonus @ 8.33%": 1.00,
      "Area Allowance": 2.00,
      "Washing Allowance": 3.00,
      "Performance Allowance": 4.00,
      "GROSS AMT": 24554.00
    },
    "DEDUCTION": {
      "EPF": 1499.00,
      "Mess": 0.00,
      "Advance": 0.00,
      "TDS": 0.00,
      "Total Deduction": 1499.00
    },
    "Net Pay Credited to Bank A/c": 23055.00
  });
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
      "Pay Slip For The Month": "April-25",
      "NAME": "Mr. HARIMAN DAS",
      "Designation": "HELPER",
      "ID": "3003",
      "Basic Rate": 595.00,
      "Days Paid": 21.0,
      "OT Hours": 20.0,
      "D.O.J": "07-Jun-11",
      "UAN": "100161838555",
      "Bank": "SBI",
      "A/c No": "35289566329",
      "IFSC": "",
      "EARNING": {
        "Wages Earned": 12495.00,
        "OT Amount": 2975.00,
        "H Allowance": 7884.00,
        "S Allowance": 1190.00,
        "Bonus @ 8.33%": 1.00,
        "Area Allowance": 2.00,
        "Washing Allowance": 3.00,
        "Performance Allowance": 4.00,
        "GROSS AMT": 24554.00
      },
      "DEDUCTION": {
        "EPF": 1499.00,
        "Mess": 0.00,
        "Advance": 0.00,
        "TDS": 0.00,
        "Total Deduction": 1499.00
      },
      "Net Pay Credited to Bank A/c": 23055.00
    });

    setTimeout(() => {
      html2pdf().set({
        margin: 1,
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
              <table style={{ width: '100%', borderCollapse: 'collapse' }} border='1'>
                <thead>
                  <tr className='banner-row'>
                    <th colspan="4" style={{textAlign: 'center', padding: '0px'}}>
                      <img
                        src={banner}
                        crossOrigin="anonymous"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </th>
                  </tr>
                  <tr className='title-row'>
                    <th colSpan={4} style={{textAlign: 'center', padding: '0px'}}>FORM XI Rules 26(2)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: "5px"}} colSpan={3}>Pay Slip For The Month</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>{payslipData["Pay Slip For The Month"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>NAME</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={2}>{payslipData["NAME"]}</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>{payslipData["Designation"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>ID</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>{payslipData["ID"]}</td>
                    <td style={{padding: "5px"}}>Basic Rate</td>
                    <td style={{padding: "5px", fontWeight: "bold", textAlign: 'right'}}>{formatCurrency(Number(payslipData["Basic Rate"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Days Paid</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>{Number(payslipData["Days Paid"]).toFixed(1)}</td>
                    <td style={{padding: "5px"}}>OT Hours</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>{Number(payslipData["OT Hours"]).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>D.O.J</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={3}>{payslipData["D.O.J"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>UAN</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={3}>{payslipData["UAN"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Bank</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={3}>{payslipData["Bank"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>A/c No</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={3}>{payslipData["A/c No"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>IFSC</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={3}>{payslipData["IFSC"]}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={2}>EARNING</td>
                    <td style={{padding: "5px", fontWeight: "bold"}} colSpan={2}>DEDUCTION</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Wages Earned</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["Wages Earned"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}>EPF</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["DEDUCTION"]["EPF"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>OT Amount</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["OT Amount"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}>Mess</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["DEDUCTION"]["Mess"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>H Allowance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["H Allowance"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}>Advance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["DEDUCTION"]["Advance"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>S Allowance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["S Allowance"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}>TDS</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["DEDUCTION"]["TDS"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Bonus @ 8.33%</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["Bonus @ 8.33%"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}></td>
                    <td style={{padding: "5px"}}></td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Area Allowance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["Area Allowance"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}></td>
                    <td style={{padding: "5px"}}></td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Washing Allowance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["Washing Allowance"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}></td>
                    <td style={{padding: "5px"}}></td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px"}}>Performance Allowance</td>
                    <td style={{padding: "5px", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["Performance Allowance"]).toFixed(2))}</td>
                    <td style={{padding: "5px"}}></td>
                    <td style={{padding: "5px"}}></td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px", fontWeight: "bold"}}>GROSS AMT</td>
                    <td style={{padding: "5px", fontWeight: "bold", textAlign: 'right'}}>{formatCurrency(Number(payslipData["EARNING"]["GROSS AMT"]).toFixed(2))}</td>
                    <td style={{padding: "5px", fontWeight: "bold"}}>Total Deduction</td>
                    <td style={{padding: "5px", fontWeight: "bold", textAlign: 'right'}}>{formatCurrency(Number(payslipData["DEDUCTION"]["Total Deduction"]).toFixed(2))}</td>
                  </tr>
                  <tr>
                    <td style={{padding: "5px", fontWeight: "bold"}} colspan="2">Net Pay Credited to Bank A/c</td>                  
                    <td style={{padding: "5px", fontWeight: "bold", textAlign: 'right'}} colspan="2">{formatCurrency(Number(payslipData["Net Pay Credited to Bank A/c"]).toFixed(2))}</td>
                  </tr>
                </tbody>
              </table>
              <p style={{marginTop: "30px"}}><b>Note:</b> This is system generated payslip and does not require signature</p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Home;
