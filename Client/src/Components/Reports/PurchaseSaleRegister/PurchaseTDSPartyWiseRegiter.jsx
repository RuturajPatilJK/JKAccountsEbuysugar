// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { formatReadableAmount } from "../../../Common/FormatFunctions/FormatAmount";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TableFooter } from '@mui/material';
// import { RingLoader } from 'react-spinners';
// import { FormaDateBalanceSheet } from "../../../Common/FormatFunctions/FormatDate"

// const apikey = process.env.REACT_APP_API;

// const PurchaseTDSPartyWiseRegister = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     // const { fromDate, toDate } = location.state || { fromDate: '', toDate: '' ,companyCode : '',Year_Code : ''};
//     const searchParams = new URLSearchParams(location.search);
//     const fromDate = searchParams.get('fromDate');
//     const Company_Name = sessionStorage.getItem('Company_Name')
//     const Company_GSTNO = sessionStorage.getItem('Company_GSTNO')

//     const toDate = searchParams.get('toDate');
//     const company_Code = searchParams.get('companyCode');
//     const YearCode = searchParams.get('yearCode');
//     const acCode = searchParams.get('acCode');

//     const [reportData, setReportData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const [grandTotals, setGrandTotals] = useState({
//         TotalTaxable_Amt: 0,
//         CGSTAmt: 0,
//         SGSTAmt: 0,
//         IGSTAmt: 0,
//         BillamountAmt: 0,
//         TDSAmt: 0
//     });

//     const API_URL = `${apikey}/PurchaseTDS_Register`;

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}/${month}/${year}`;
//     };

//     useEffect(() => {
//         const fetchReportData = async () => {
//             setLoading(true);
//             setError('');
//             try {
//                 const response = await axios.get(API_URL, {
//                     params: {
//                         from_date: fromDate,
//                         toDate: toDate,
//                         companyCode: company_Code,
//                         YearCode: YearCode,
//                         acCode: acCode
//                     },
//                 });

//                 setReportData(response.data);
//             } catch (error) {
//                 console.error('Error fetching report:', error);
//                 setError('Error fetching report');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReportData();
//     }, [API_URL]);

//     const handleExportToExcel = () => {
//         const wb = XLSX.utils.book_new();

//         const headers = [
//             "PAN", "Party Name", "Taxable Amount", "CGST", "SGST", "IGST", "Bill Amount", "TDS Amount"
//         ];

//         const formattedData = reportData.map(item => ({
//             PAN: item.Pan,
//             "Party Name": item.Name_Of_Party,
//             "Taxable Amount": Number(item.Taxable_Amt) || 0,
//             "CGST": Number(item.CGST) || 0,
//             "SGST": Number(item.SGST) || 0,
//             "IGST": Number(item.IGST) || 0,
//             "Bill Amount": Number(item.Bill_Amount) || 0,
//             "TDS Amount": Number(item.TDS_Amt) || 0
//         }));

//         const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });

//         const wsCols = [
//             { wch: 15 },
//             { wch: 30 },
//             { wch: 15, alignment: { horizontal: "right" } },
//             { wch: 10, alignment: { horizontal: "right" } },
//             { wch: 10, alignment: { horizontal: "right" } },
//             { wch: 10, alignment: { horizontal: "right" } },
//             { wch: 15, alignment: { horizontal: "right" } },
//             { wch: 12, alignment: { horizontal: "right" } }
//         ];
//         ws["!cols"] = wsCols;

//         XLSX.utils.book_append_sheet(wb, ws, 'PurchaseTDSRegister');
//         XLSX.writeFile(wb, 'PurchaseTDSRegister.xlsx');
//     };


//     const handlePrint = async () => {
//         try {
//             const companyName = Company_Name;
//             const fromDate = searchParams.get('fromDate');
//             const toDate = searchParams.get('toDate');

//             if (!reportData || reportData.length === 0) {
//                 console.error("Error: reportData is empty or undefined");
//                 return;
//             }

//             const pdfBlob = await generatePDF(companyName, fromDate, toDate, reportData);

//             if (!pdfBlob || !(pdfBlob instanceof Blob)) {
//                 console.error("Error: Invalid PDF Blob", pdfBlob);
//                 return;
//             }

//             const pdfUrl = URL.createObjectURL(pdfBlob);
//             const win = window.open(pdfUrl);

//             if (!win) {
//                 console.error("Popup blocked! Allow popups to print the PDF.");
//                 return;
//             }

//             setTimeout(() => win.print(), 1000);
//         } catch (error) {
//             console.error("Error in handlePrint:", error);
//         }
//     };

//     const generatePDF = async (companyName, fromDate, toDate, reportData) => {
//         if (!Array.isArray(reportData) || reportData.length === 0) {
//             console.error("Error: reportData is invalid", reportData);
//             return;
//         }

//         const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

//         const groupedData = groupReportData(reportData) || {};
//         const tableData = [];

//         doc.setFontSize(16);
//         doc.text(companyName, doc.internal.pageSize.width / 2, 10, { align: "center" });

//         doc.setFontSize(10);
//         doc.text(`Purchase TDS PartyWise Register From: ${formatDate(fromDate)} To: ${formatDate(toDate)}`, 10, 20);

//         const headers = [
//             "Bill No", "DONO", "Inv Date", "MillBill No",
//             "Taxable Amt", "CGST Amt", "SGST Amt", "IGST Amt", "Bill Amount", "TDS"
//         ];
//         tableData.push(headers);

//         let grandTotals = {
//             TotalTaxable_Amt: 0,
//             CGSTAmt: 0,
//             SGSTAmt: 0,
//             IGSTAmt: 0,
//             BillamountAmt: 0,
//             TDSAmt: 0
//         };

//         Object.entries(groupedData).forEach(([key, group]) => {
//             if (!group.items || group.items.length === 0) return;

//             const parts = key.split("-");
//             const pan = parts[parts.length - 1];
//             const partyName = parts.slice(1, -1).join("-");

//             tableData.push([
//                 { content: pan, colSpan: 2, styles: { fontStyle: "bold", textColor: [255, 0, 0], fontSize: 10 } },
//                 { content: partyName, colSpan: 2, styles: { fontStyle: "bold", textColor: [255, 0, 0], fontSize: 10 } },
//                 { content: formatReadableAmount(group.TotalTaxable_Amt || 0), styles: { fontStyle: "bold" } },
//                 { content: formatReadableAmount(group.CGSTAmt || 0), styles: { fontStyle: "bold" } },
//                 { content: formatReadableAmount(group.SGSTAmt || 0), styles: { fontStyle: "bold" } },
//                 { content: formatReadableAmount(group.IGSTAmt || 0), styles: { fontStyle: "bold" } },
//                 { content: formatReadableAmount(group.BillamountAmt || 0), styles: { fontStyle: "bold" } },
//                 { content: formatReadableAmount(group.TDSAmt || 0), styles: { fontStyle: "bold" } }
//             ]);
//             group.items.forEach(item => {
//                 tableData.push([
//                     item.PSNo,
//                     item.dono,
//                     item.date,
//                     item.Bill_No,
//                     formatReadableAmount(item.Taxable_Amt),
//                     formatReadableAmount(item.CGST),
//                     formatReadableAmount(item.SGST),
//                     formatReadableAmount(item.IGST),
//                     formatReadableAmount(item.Bill_Amount),
//                     formatReadableAmount(item.TDS_Amt)
//                 ]);
//             });

//             grandTotals.TotalTaxable_Amt += group.TotalTaxable_Amt || 0;
//             grandTotals.CGSTAmt += group.CGSTAmt || 0;
//             grandTotals.SGSTAmt += group.SGSTAmt || 0;
//             grandTotals.IGSTAmt += group.IGSTAmt || 0;
//             grandTotals.BillamountAmt += group.BillamountAmt || 0;
//             grandTotals.TDSAmt += group.TDSAmt || 0;
//         });

//         tableData.push([
//             { content: "Grand Total", colSpan: 4, styles: { fontStyle: "bold", fillColor: [255, 255, 0], halign: "right" } },
//             { content: formatReadableAmount(grandTotals.TotalTaxable_Amt), styles: { fillColor: [255, 255, 0] } },
//             { content: formatReadableAmount(grandTotals.CGSTAmt), styles: { fillColor: [255, 255, 0] } },
//             { content: formatReadableAmount(grandTotals.SGSTAmt), styles: { fillColor: [255, 255, 0] } },
//             { content: formatReadableAmount(grandTotals.IGSTAmt), styles: { fillColor: [255, 255, 0] } },
//             { content: formatReadableAmount(grandTotals.BillamountAmt), styles: { fillColor: [255, 255, 0] } },
//             { content: formatReadableAmount(grandTotals.TDSAmt), styles: { fillColor: [255, 255, 0] } }
//         ]);

//         doc.autoTable({
//             headStyles: { fillColor: [255, 0, 0], fontStyle: "bold" },
//             body: tableData,
//             margin: { top: 25, left: 10 },
//             styles: { fontSize: 8, cellPadding: 2, halign: "center" },
//             columnStyles: {
//                 0: { halign: "center", cellWidth: 22 },
//                 1: { halign: "center", cellWidth: 22 },
//                 2: { halign: "left", cellWidth: 20 },
//                 3: { halign: "center", cellWidth: 30 },
//                 4: { halign: "right", cellWidth: 30 },
//                 5: { halign: "right", cellWidth: 25 },
//                 6: { halign: "right", cellWidth: 25 },
//                 7: { halign: "right", cellWidth: 25 },
//                 8: { halign: "right", cellWidth: 35 },
//                 9: { halign: "right", cellWidth: 35 }
//             },
//             theme: "grid",
//         });

//         return doc.output("blob");
//     };


//     const groupReportData = (data) => {
//         const groupedData = {};
//         data.forEach((item) => {
//             const key = `${item.Party_Code}-${item.Name_Of_Party}-${item.Pan}`;
//             if (!groupedData[key]) {
//                 groupedData[key] = {
//                     items: [],
//                     TotalTaxable_Amt: 0,
//                     CGSTAmt: 0,
//                     SGSTAmt: 0,
//                     IGSTAmt: 0,
//                     BillamountAmt: 0,
//                     TDSAmt: 0,

//                 };
//             }
//             groupedData[key].items.push(item);
//             groupedData[key].TotalTaxable_Amt += parseFloat(item.Taxable_Amt) || 0;
//             groupedData[key].CGSTAmt += parseFloat(item.CGST) || 0;
//             groupedData[key].SGSTAmt += parseFloat(item.SGST) || 0;
//             groupedData[key].IGSTAmt += parseFloat(item.IGST) || 0;
//             groupedData[key].BillamountAmt += parseFloat(item.Bill_Amount) || 0;
//             groupedData[key].TDSAmt += parseFloat(item.TDS_Amt) || 0;

//         });
//         return groupedData;
//     };

//     const groupedReportData = groupReportData(reportData);


//     useEffect(() => {
//         const totals = Object.values(groupedReportData).reduce(
//             (totals, { TotalTaxable_Amt, CGSTAmt, SGSTAmt, IGSTAmt, BillamountAmt, TDSAmt }) => {
//                 totals.TotalTaxable_Amt += TotalTaxable_Amt || 0;
//                 totals.CGSTAmt += CGSTAmt || 0;
//                 totals.SGSTAmt += SGSTAmt || 0;
//                 totals.IGSTAmt += IGSTAmt || 0;
//                 totals.BillamountAmt += BillamountAmt || 0;
//                 totals.TDSAmt += TDSAmt || 0;
//                 return totals;
//             },
//             { TotalTaxable_Amt: 0, CGSTAmt: 0, SGSTAmt: 0, IGSTAmt: 0, BillamountAmt: 0, TDSAmt: 0 }
//         );

//         setGrandTotals(totals);
//     }, [groupedReportData]);
//     return (
//         <div style={{marginTop:"-80px"}}>
//             <Typography variant="h6" style={{ textAlign: 'center', fontSize: "24px", fontWeight: "bold" }}>{Company_Name}</Typography>
//             <Typography variant="h6" style={{ textAlign: 'center', fontSize: "16px", textDecoration: 'underline', fontWeight: "550" }}>GSTN : {Company_GSTNO}</Typography>
//             <Typography variant="h6" style={{ textAlign: 'center', fontSize: "20px", fontWeight: "bold" }}>Purchase TDS Party Wise</Typography>
//             <Typography variant="h6" style={{ textAlign: 'center', fontSize: "16px" }}>{FormaDateBalanceSheet(fromDate)} to {FormaDateBalanceSheet(toDate)}</Typography>

//             <div className="mb-3 row align-items-center">
//                 <div className="col-auto">
//                     <button className="btn btn-secondary me-2" onClick={handlePrint}>Print</button>
//                     <button className="btn btn-success" onClick={handleExportToExcel}>Export to Excel</button>
//                 </div>
//             </div>

//             <div style={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto', border: '1px solid #ccc' }}>
//                 <Table stickyHeader aria-label="Purchase TDS PartyWise register" sx={{ minWidth: 900 }}>
//                     <TableHead>
//                         <TableRow sx={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0, zIndex: 2 }}>
//                             <TableCell sx={{ width: '120px', textAlign: "center", fontWeight: "bold" }}>Bill No</TableCell>
//                             <TableCell sx={{ width: '100px', textAlign: "center", fontWeight: "bold" }}>DONO</TableCell>
//                             <TableCell sx={{ width: '130px', textAlign: "left", fontWeight: "bold" }}>Inv Date</TableCell>
//                             <TableCell sx={{ width: '120px', textAlign: "center", fontWeight: "bold" }}>MillBill No</TableCell>
//                             <TableCell sx={{ width: '150px', textAlign: "right", fontWeight: "bold" }}>Taxable Amount</TableCell>
//                             <TableCell sx={{ width: '130px', textAlign: "right", fontWeight: "bold" }}>CGST Amount</TableCell>
//                             <TableCell sx={{ width: '130px', textAlign: "right", fontWeight: "bold" }}>SGST Amount</TableCell>
//                             <TableCell sx={{ width: '130px', textAlign: "right", fontWeight: "bold" }}>IGST Amount</TableCell>
//                             <TableCell sx={{ width: '150px', textAlign: "right", fontWeight: "bold" }}>Bill Amount</TableCell>
//                             <TableCell sx={{ width: '120px', textAlign: "right", fontWeight: "bold" }}>TDS</TableCell>
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>
//                         {Object.entries(groupedReportData).map(([key, { items, TotalTaxable_Amt, CGSTAmt, SGSTAmt, IGSTAmt, BillamountAmt, TDSAmt }]) => {
//                             const parts = key.split('-');
//                             const mc = parts[0];
//                             const pan = parts[parts.length - 1];
//                             const PartyName = parts.slice(1, -1).join('-');

//                             return (
//                                 <React.Fragment key={key}>
//                                     <TableRow>
//                                         <TableCell align="center" colSpan={2} sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{pan}</TableCell>
//                                         <TableCell align="left" colSpan={2} sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{PartyName}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(TotalTaxable_Amt.toFixed(2))}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(CGSTAmt.toFixed(2))}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(SGSTAmt.toFixed(2))}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(IGSTAmt.toFixed(2))}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(BillamountAmt.toFixed(2))}</TableCell>
//                                         <TableCell align="right" sx={{ fontWeight: 'bold', color: 'blue', fontSize: '14px' }}>{formatReadableAmount(TDSAmt.toFixed(2))}</TableCell>
//                                     </TableRow>

//                                     {items.map((item, index) => (
//                                         <TableRow key={index}  >
//                                             <TableCell sx={{ textAlign: "center" }}>{item.PSNo}</TableCell>
//                                             <TableCell sx={{ textAlign: "center" }}>{item.dono}</TableCell>
//                                             <TableCell sx={{ textAlign: "left" }}>{item.date}</TableCell>
//                                             <TableCell sx={{ textAlign: "center" }}>{item.Bill_No}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.Taxable_Amt)}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.CGST)}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.SGST)}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.IGST)}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.Bill_Amount)}</TableCell>
//                                             <TableCell sx={{ textAlign: "right" }}>{formatReadableAmount(item.TDS_Amt)}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </React.Fragment>
//                             );
//                         })}
//                     </TableBody>

//                     {/* Sticky Footer */}
//                     <TableFooter>
//                         <TableRow sx={{ position: 'sticky', bottom: 0, backgroundColor: 'yellow', zIndex: 1 }}>
//                             <TableCell colSpan={4} sx={{ fontWeight: 'bold', textAlign: 'right' }}>Grand Total</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.TotalTaxable_Amt.toFixed(2))}</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.CGSTAmt.toFixed(2))}</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.SGSTAmt.toFixed(2))}</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.IGSTAmt.toFixed(2))}</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.BillamountAmt.toFixed(2))}</TableCell>
//                             <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>{formatReadableAmount(grandTotals.TDSAmt.toFixed(2))}</TableCell>
//                         </TableRow>
//                     </TableFooter>
//                 </Table>
//             </div>

//             {/* Loaders & Error */}
//             {loading && (
//                 <div style={{
//                     position: 'fixed',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     zIndex: 9999
//                 }}>
//                     <RingLoader size={80} />
//                 </div>
//             )}
//             {error && <div className="alert alert-danger">{error}</div>}
//         </div>
//     );
// };

// export default PurchaseTDSPartyWiseRegister;

























import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom';
import { formatReadableAmount } from '../../../Common/FormatFunctions/FormatAmount';
import { ScaleLoader } from 'react-spinners';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, TableFooter, TableSortLabel,
} from '@mui/material';
import { FormaDateBalanceSheet } from '../../../Common/FormatFunctions/FormatDate';
import PdfPreview from '../../../Common/PDFPreview';
import HeaderJK from '../../../Assets/HeaderJK.png';
import FooterJK from '../../../Assets/FooterJK.png';
import { ConvertNumberToWord } from '../../../Common/FormatFunctions/ConvertNumberToWord';

import CommonPrintView from '../../../Common/ReportCommon/CommonPrintView';
import { generateReportPDF } from '../../../Common/ReportCommon/CommonPDFGenerator';

import '../../../Common/Fonts/Signika-Bold-normal';
import '../../../Common/Fonts/Signika-Regular-normal';

const apikey = process.env.REACT_APP_API;

// 1. Column Definitions
const SCREEN_COLUMNS = [
    { label: 'Bill No', key: 'PSNo', width: '8%' },
    { label: 'DONO', key: 'dono', width: '8%' },
    { label: 'Inv Date', key: 'date', width: '10%' },
    { label: 'Mill Bill', key: 'Bill_No', width: '10%' },
    { label: 'Taxable', key: 'Taxable_Amt', width: '10%', numeric: true },
    { label: 'CGST', key: 'CGST', width: '8%', numeric: true },
    { label: 'SGST', key: 'SGST', width: '8%', numeric: true },
    { label: 'IGST', key: 'IGST', width: '8%', numeric: true },
    { label: 'Bill Amount', key: 'Bill_Amount', width: '12%', numeric: true },
    { label: 'TDS', key: 'TDS_Amt', width: '8%', numeric: true },
];

const PRINT_COLUMNS = [
    { label: 'Bill No', key: 'PSNo', printWidth: '18mm' },
    { label: 'Inv Date', key: 'date', printWidth: '22mm' },
    { label: 'Mill Bill', key: 'Bill_No', printWidth: '22mm' },
    { label: 'Taxable', key: 'Taxable_Amt', printWidth: '20mm', numeric: true },
    { label: 'CGST', key: 'CGST', printWidth: '20mm', numeric: true },
    { label: 'SGST', key: 'SGST', printWidth: '20mm', numeric: true },
    { label: 'IGST', key: 'IGST', printWidth: '20mm', numeric: true },
    { label: 'Bill Amt', key: 'Bill_Amount', printWidth: '25mm', numeric: true },
    { label: 'TDS', key: 'TDS_Amt', printWidth: '24mm', numeric: true },
];

const PRINT_NUMERIC_COLS = PRINT_COLUMNS.map((c, i) => (c.numeric ? i : null)).filter(i => i !== null);

const PurchaseTDSPartyWiseRegister = () => {
    const location = useLocation();
    const Company_Name = sessionStorage.getItem('Company_Name');
    const Company_GSTNO = sessionStorage.getItem('Company_GSTNO');
    const searchParams = new URLSearchParams(location.search);

    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const company_Code = searchParams.get('companyCode');
    const YearCode = searchParams.get('yearCode');
    const acCode = searchParams.get('acCode');

    const [pdfPreview, setPdfPreview] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'Name_Of_Party', direction: 'asc' });

    const API_URL = `${apikey}/PurchaseTDS_Register`;

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_URL, {
                    params: { from_date: fromDate, toDate, companyCode: company_Code, YearCode, acCode },
                });
                setReportData(response.data);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, [API_URL, fromDate, toDate, company_Code, YearCode, acCode]);

    const requestSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const groupedData = useMemo(() => {
        let items = [...reportData];
        if (sortConfig.key) {
            items.sort((a, b) => {
                const va = a[sortConfig.key] || "";
                const vb = b[sortConfig.key] || "";
                if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
                if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const groups = {};
        items.forEach((item) => {
            const key = `${item.Party_Code}-${item.Name_Of_Party}-${item.Pan}`;
            if (!groups[key]) {
                groups[key] = {
                    PartyName: item.Name_Of_Party,
                    PAN: item.Pan,
                    items: [],
                    subTaxable: 0, subCGST: 0, subSGST: 0, subIGST: 0, subBill: 0, subTDS: 0
                };
            }
            groups[key].items.push(item);
            groups[key].subTaxable += parseFloat(item.Taxable_Amt) || 0;
            groups[key].subCGST += parseFloat(item.CGST) || 0;
            groups[key].subSGST += parseFloat(item.SGST) || 0;
            groups[key].subIGST += parseFloat(item.IGST) || 0;
            groups[key].subBill += parseFloat(item.Bill_Amount) || 0;
            groups[key].subTDS += parseFloat(item.TDS_Amt) || 0;
        });
        return groups;
    }, [reportData, sortConfig]);

    const grandTotals = useMemo(() =>
        Object.values(groupedData).reduce((acc, g) => {
            acc.Taxable_Amt += g.subTaxable;
            acc.CGST += g.subCGST;
            acc.SGST += g.subSGST;
            acc.IGST += g.subIGST;
            acc.Bill_Amount += g.subBill;
            acc.TDS_Amt += g.subTDS;
            return acc;
        }, { Taxable_Amt: 0, CGST: 0, SGST: 0, IGST: 0, Bill_Amount: 0, TDS_Amt: 0 }),
        [groupedData]);

    const reportSubtitle = `${FormaDateBalanceSheet(fromDate)} to ${FormaDateBalanceSheet(toDate)}`;

    // Row Renderer for Table
    const renderScreenRow = (item) => [
        item.PSNo, item.dono, item.date, item.Bill_No,
        formatReadableAmount(item.Taxable_Amt),
        formatReadableAmount(item.CGST),
        formatReadableAmount(item.SGST),
        formatReadableAmount(item.IGST),
        formatReadableAmount(item.Bill_Amount),
        formatReadableAmount(item.TDS_Amt)
    ];

    // Row Renderer for Print/PDF
    const renderPrintRow = (item) => [
        item.PSNo, item.date, item.Bill_No,
        formatReadableAmount(item.Taxable_Amt),
        formatReadableAmount(item.CGST),
        formatReadableAmount(item.SGST),
        formatReadableAmount(item.IGST),
        formatReadableAmount(item.Bill_Amount),
        formatReadableAmount(item.TDS_Amt)
    ];

  const handleGeneratePDF = () => {
    const pdfRows = [];
    const yellowFooterStyle = { fillColor: [255, 249, 196], fontStyle: 'bold' };
    
    Object.values(groupedData).forEach(group => {
        // Group Header (Gray row) with styled sub-totals
        pdfRows.push([
            { content: `PAN: ${group.PAN} - ${group.PartyName}`, colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
            { content: formatReadableAmount(group.subTaxable.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
            { content: formatReadableAmount(group.subCGST.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
            { content: formatReadableAmount(group.subSGST.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
            { content: formatReadableAmount(group.subIGST.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
            { content: formatReadableAmount(group.subBill.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
            { content: formatReadableAmount(group.subTDS.toFixed(2)), styles: { fontStyle: 'bold', fillColor: [240, 240, 240], halign: 'right' } },
        ]);
        
        group.items.forEach(item => pdfRows.push(renderPrintRow(item)));
    });

    generateReportPDF({
        title: 'Purchase TDS Partywise Register',
        subtitle: reportSubtitle,
        columns: PRINT_COLUMNS.map(c => c.label),
        columnWidths: PRINT_COLUMNS.map(c => parseInt(c.printWidth)),
        rows: pdfRows,
        
        // Final Grand Total with Yellow Background
        footerRow: [
            { content: '', styles: yellowFooterStyle },
            { content: '', styles: yellowFooterStyle },
            { content: 'GRAND TOTAL', styles: yellowFooterStyle },
            { content: formatReadableAmount(grandTotals.Taxable_Amt.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } },
            { content: formatReadableAmount(grandTotals.CGST.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } },
            { content: formatReadableAmount(grandTotals.SGST.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } },
            { content: formatReadableAmount(grandTotals.IGST.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } },
            { content: formatReadableAmount(grandTotals.Bill_Amount.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } },
            { content: formatReadableAmount(grandTotals.TDS_Amt.toFixed(2)), styles: { ...yellowFooterStyle, halign: 'right' } }
        ],
        
        numericCols: PRINT_NUMERIC_COLS,
        amountInWords: ConvertNumberToWord(grandTotals.Bill_Amount),
        headerImgSrc: HeaderJK,
        footerImgSrc: FooterJK,
        orientation: 'landscape',
        onComplete: (url) => setPdfPreview(url),
    });
};
    const handleExportToExcel = () => {
        const headers = SCREEN_COLUMNS.map(c => c.label);
        const worksheetData = [
            [Company_Name.toUpperCase()],
            [`GST No: ${Company_GSTNO}`],
            [`Purchase TDS Register: ${reportSubtitle}`],
            [],
            headers
        ];

        Object.values(groupedData).forEach(group => {
            worksheetData.push([group.PAN, group.PartyName, "", "", group.subTaxable, group.subCGST, group.subSGST, group.subIGST, group.subBill, group.subTDS]);
            group.items.forEach(item => {
                worksheetData.push(SCREEN_COLUMNS.map(col => col.numeric ? Number(item[col.key]) : item[col.key]));
            });
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(wb, ws, 'TDS_Register');
        XLSX.writeFile(wb, `TDS_Register_${fromDate}.xlsx`);
    };

    return (
        <div style={{ padding: '20px', marginTop: '-80px' }}>
            <Typography variant="h5" align="center" style={{ fontWeight: 'bold' }}>{Company_Name}</Typography>
            <Typography variant="subtitle1" align="center">GSTN: {Company_GSTNO}</Typography>
            <Typography variant="h6" align="center">Purchase TDS Partywise Register</Typography>
            <Typography variant="subtitle2" align="center" color="textSecondary">{reportSubtitle}</Typography>

            <div className="my-3 no-print d-flex justify-content-end">
                <button className="btn btn-danger" onClick={handleGeneratePDF}>Print PDF</button>
                <button className="btn btn-success ms-2" onClick={handleExportToExcel}>Export Excel</button>
            </div>

            {pdfPreview && <PdfPreview pdfData={pdfPreview} label="PurchaseTDSRegisterPartywise" />}

            <TableContainer component={Paper} style={{ maxHeight: '700px' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {SCREEN_COLUMNS.map(col => (
                                <TableCell
                                    key={col.key}
                                    align={col.numeric ? 'right' : 'left'}
                                    style={{ backgroundColor: '#5557df', color: '#fff', fontWeight: 'bold' }}
                                >
                                    <TableSortLabel
                                        active={sortConfig.key === col.key}
                                        direction={sortConfig.direction}
                                        onClick={() => requestSort(col.key)}
                                        sx={{ '&.Mui-active, & .MuiTableSortLabel-icon': { color: '#fff !important' }, '&:hover': { color: '#fff' } }}
                                    > {col.label} </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(groupedData).map(([key, group]) => (
                            <React.Fragment key={key}>
                                <TableRow style={{ backgroundColor: '#f0f4ff' }}>
                                    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{group.PAN}</TableCell>
                                    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{group.PartyName}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subTaxable.toFixed(2))}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subCGST.toFixed(2))}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subSGST.toFixed(2))}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subIGST.toFixed(2))}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subBill.toFixed(2))}</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(group.subTDS.toFixed(2))}</TableCell>
                                </TableRow>
                                {group.items.map((item, idx) => (
                                    <TableRow key={idx} hover>
                                        {renderScreenRow(item).map((cell, i) => (
                                            <TableCell key={i} align={SCREEN_COLUMNS[i].numeric ? 'right' : 'left'}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                    <TableFooter style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
                        <TableRow style={{ backgroundColor: '#ffffcc' }}>
                            <TableCell colSpan={4} style={{ fontWeight: 'bold' }}>GRAND TOTAL</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.Taxable_Amt.toFixed(2))}</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.CGST.toFixed(2))}</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.SGST.toFixed(2))}</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.IGST.toFixed(2))}</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.Bill_Amount.toFixed(2))}</TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>{formatReadableAmount(grandTotals.TDS_Amt.toFixed(2))}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            {loading && <div className="text-center mt-4"><ScaleLoader color="#36d7b7" /></div>}
        </div>
    );
};

export default PurchaseTDSPartyWiseRegister;
