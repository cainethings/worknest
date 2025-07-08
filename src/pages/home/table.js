import React from 'react';
import banner from '../../assets/images/banner.png';
const HiddenData = (props) => {
    const formatCurrency = (amount) =>
        `${Number(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    const excelSerialToDateString = (serialStr) => {
        if (!serialStr) return "";

        const serial = parseFloat(serialStr.replace(/,/g, ""));
        if (isNaN(serial)) return serialStr;

        const excelEpoch = new Date(1900, 0, 1);
        const days = Math.floor(serial) - 2;
        const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }); // e.g. "14 February 2018"
    }
    const payslipData = props.payslipData;
    const selectedMonth = props.selectedMonth;
    return (
        <>
            <style>
                {`
                    table, th, td {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 5px;
                    }
                    th {
                        background-color: #f0f0f0;
                    }
                `}
            </style>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border='1'>
                <thead>
                    <tr className='banner-row'>
                        <th colSpan="4" style={{ textAlign: 'center', padding: '0px' }}>
                            <img
                                src={banner}
                                crossOrigin="anonymous"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </th>
                    </tr>
                    <tr className='title-row'>
                        <th colSpan={4} style={{ textAlign: 'center', padding: '0px' }}>FORM XI Rules 26(2)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: "5px" }} colSpan={3}>Pay Slip For The Month</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>{selectedMonth}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>NAME</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={2}>Mr. {payslipData["FULL NAME"]}</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>{payslipData["Designation"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>ID</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>{payslipData["ID"] || payslipData["\ufeffID"]}</td>
                        <td style={{ padding: "5px" }}>Basic Rate</td>
                        <td style={{ padding: "5px", fontWeight: "bold", textAlign: 'right' }}>{payslipData["Basic Rate"] === "" ? "0.00" : payslipData["Basic Rate"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>Days Paid</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>{Number(payslipData["Days Paid"]).toFixed(1)}</td>
                        <td style={{ padding: "5px" }}>{payslipData["F/D"] === "D" ? "OT Hours" : ""}</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>{payslipData["F/D"] === "D" ? Number(payslipData["OT Hours"]).toFixed(1) : ""}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>D.O.J</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={3}>
                            {excelSerialToDateString(payslipData["D.O.J"])}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>UAN</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={3}>{payslipData["UAN"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>Bank</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={3}>{payslipData["Bank"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>A/c No</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={3}>{payslipData["A/c No"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>IFSC</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={3}>{payslipData["IFSC"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={2}>EARNING</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan={2}>DEDUCTION</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>Wages Earned</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Wages Earned"] === "" ? "0.00" : payslipData["Wages Earned"]}</td>
                        <td style={{ padding: "5px" }}>EPF</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["EPF"] === "" ? "0.00" : payslipData["EPF"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>{payslipData["F/D"] === "D" ? "OT Amount" : "HRA"}</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["F/D"] === "D" ? payslipData["OT Amount"] === "" ? "0.00" : payslipData["OT Amount"] : payslipData["HRA"] === "" ? "0.00" : payslipData["HRA"]}</td>
                        <td style={{ padding: "5px" }}>Mess</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Mess"] === "" ? "0.00" : payslipData["Mess"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>{payslipData["F/D"] === "D" ? "H Allowance" : "Proj Allowance"}</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["F/D"] === "D" ? payslipData["H Allowance"] === "" ? "0.00" : payslipData["H Allowance"] : payslipData["Proj Allowance"] === "" ? "0.00" : payslipData["Proj Allowance"]}</td>
                        <td style={{ padding: "5px" }}>Advance</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Advance"] === "" ? "0.00" : formatCurrency(parseFloat(payslipData["Advance"]).toFixed(2))}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px" }}>{payslipData["F/D"] === "S" ? "SCA / DA" : payslipData["F/D"] === "D" ? "S Allowance" : "V Allowance"}</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["F/D"] === "S" ? (payslipData["SCA \/ DA"] === "" ? "0.00" : payslipData["SCA \/ DA"]) : payslipData["F/D"] === "D" ? payslipData["S Allowance"] === "" ? "0.00" : payslipData["S Allowance"] : payslipData["V Allowance"] === "" ? "0.00" : payslipData["V Allowance"]}</td>
                        <td style={{ padding: "5px" }}>TDS</td>
                        <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["TDS"] === "" ? "0.00" : formatCurrency(parseFloat(payslipData["TDS"]).toFixed(2))}</td>
                    </tr>
                    {
                        payslipData["F/D"] === "D" || payslipData["F/D"] === "F" ? (
                            <>
                                <tr>
                                    <td style={{ padding: "5px" }}>Bonus @ 8.33%</td>
                                    <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Bonus @ 8.33%"] === "" ? "0.00" : payslipData["Bonus @ 8.33%"]}</td>
                                    <td style={{ padding: "5px" }}></td>
                                    <td style={{ padding: "5px" }}></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "5px" }}>Area Allowance</td>
                                    <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Area Allowance"] === "" ? "0.00" : payslipData["Area Allowance"]}</td>
                                    <td style={{ padding: "5px" }}></td>
                                    <td style={{ padding: "5px" }}></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "5px" }}>Washing Allowance</td>
                                    <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Washing Allowance"] === "" ? "0.00" : payslipData["Washing Allowance"]}</td>
                                    <td style={{ padding: "5px" }}></td>
                                    <td style={{ padding: "5px" }}></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "5px" }}>Performance Allowance</td>
                                    <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Performance Allowance"] === "" ? "0.00" : payslipData["Performance Allowance"]}</td>
                                    <td style={{ padding: "5px" }}></td>
                                    <td style={{ padding: "5px" }}></td>
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <td style={{ padding: "5px" }}>Mess Allow</td>
                                    <td style={{ padding: "5px", textAlign: 'right' }}>{payslipData["Mess Allow"] === "" ? "0.00" : payslipData["Mess Allow"]}</td>
                                    <td style={{ padding: "5px" }}></td>
                                    <td style={{ padding: "5px" }}></td>
                                </tr>
                            </>
                        )
                    }

                    <tr>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>GROSS AMT</td>
                        <td style={{ padding: "5px", fontWeight: "bold", textAlign: 'right' }}>{payslipData["GROSS AMT"] === "" ? "0.00" : payslipData["GROSS AMT"]}</td>
                        <td style={{ padding: "5px", fontWeight: "bold" }}>Total Deduction</td>
                        <td style={{ padding: "5px", fontWeight: "bold", textAlign: 'right' }}>{payslipData["Total Deduction"] === "" ? "0.00" : payslipData["Total Deduction"]}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", fontWeight: "bold" }} colSpan="2">Net Pay Credited to Bank A/c</td>
                        <td style={{ padding: "5px", fontWeight: "bold", textAlign: 'center' }} colSpan="2">{payslipData["Net Pay Credited to Bank A/c"] === "" ? "₹0.00" : "₹" + payslipData["Net Pay Credited to Bank A/c"]}</td>
                    </tr>
                </tbody>
            </table>
        </>

    )
}

export default HiddenData;