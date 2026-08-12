import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  TableSortLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import NoDataAlert from "../Alert/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import io from "socket.io-client";
import EWayBillNEInvoiceGen from "../EwayBillGenrateProcess/EWayBillGenrationProcess.jsx";
import EWayBillReport from "../Reports/EWayReport/EWayBillReport.jsx";
import SaleBillReport from "../Reports/SaleBillReport/SaleBillReport.jsx";
import SearchBar from "../../../Common/SearchBar/SearchBar.jsx";
import PrintButton from "../../../Common/Buttons/Print.jsx";
import { RingLoader } from "react-spinners";
import CircularSpinner from "../../../Common/Spinners/CircularSpinner"
import { formatReadableAmount } from "../../../Common/FormatFunctions/FormatAmount";

// Table Style
const tableCellStyleHeader = {
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#f4f4f4',
  whiteSpace: 'nowrap',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const tableCellStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};
const apikey = process.env.REACT_APP_API;
const socketURL = process.env.REACT_APP_API_URL;

const GenerateEwayBill = ({ fromDate }) => {

  const Company_Code = sessionStorage.getItem('Company_Code');
  const Year_Code = sessionStorage.getItem('Year_Code');

  // const Company_Code = 1
  // const Year_Code = 4


  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [page, setPage] = useState(0);
  const [selectedSaleIds, setSelectedSaleIds] = useState([]);
  const [
    selectedSaleIdsEWayBillsEInvoice,
    setSelectedSaleIdsEWayBillsEInvoice,
  ] = useState([]);
  const [selectedSaleIdsEWayBills, setSelectedSaleIdsEWayBills] = useState([]);
  const [selectedSaleIdsForSaleBill, setSelectedSaleIdsForSaleBill] = useState(
    []
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showEwayBillReport, setShowEwayBillReport] = useState(false);
  const [saleBilReport, setSaleBilReport] = useState(false);
  const [ewayBillNo, setEwayBillNo] = useState([]);
  const [vehicleNo, setVehicleNo] = useState([]);
  const [doNo, setDoNo] = useState([]);
  const [millDoc_No, setMillDoc_No] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");

  //Calculate the Taxable Amount on enter the vehicle number States
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [millAmount, setMillAmount] = useState(0);

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, [fromDate]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apikey}/getMatchingPurchaseewaybills`,
        {
          params: {
            doc_date: fromDate,
            Company_Code: Company_Code,
            Year_Code: Year_Code,
          },
        }
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  //Socket IO implementation
  useEffect(() => {
    //  const isSecure = socketURL.startsWith("https");
    const socket = io(`${socketURL}`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      // secure: isSecure,
    });
    socket.on("connect", () => { });

    socket.on("updatedocno", () => {
      console.log("socket worked.....")
      fetchData();
    });

    socket.on("updatesalesugar", () => {
      fetchData();
    });

    socket.on("pdf_email_status", () => {
      fetchData();
    });

    socket.on("disconnect", () => {
      console.log("socket not worked.....")
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle search functionality
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle checkbox change
  const handleCheckboxChange = (rowIndex, isChecked, saleid) => {
    const updatedData = [...filteredData];
    updatedData[rowIndex].isSelected = isChecked;
    setFilteredData(updatedData);
    if (isChecked) {
      setSelectedSaleIds((prevIds) => [...prevIds, saleid]);
    } else {
      setSelectedSaleIds((prevIds) => prevIds.filter((id) => id !== saleid));
    }
  };

  const handleGenerate = (row) => {
    setSelectedSaleIdsEWayBillsEInvoice([row.saleid]);
    setVehicleNo([row.vehno]);
    setDoNo([row.DO_No]);
    setEwayBillNo([row.ewbNo]);
    setMillDoc_No([row.millDoc_No])
    setIsOpen(true);
  };

  const handleEWayBillPrint = (row) => {
    setSelectedSaleIdsEWayBills([row.saleid]);
    setEwayBillNo([row.ewbNo]);
    setShowEwayBillReport(true);
  };

  const handleSaleBillPrint = (row) => {
    setSelectedSaleIdsForSaleBill([row.saleid]);
    setEwayBillNo([row.ewbNo]);
    setSaleBilReport(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle generate sale bill and ewaybill button clicks
  const handleSaleBillNo = async () => {
    if (selectedSaleIds.length > 0) {
      setLoading(true);
      try {
        const apiUrl = `${apikey}/update-doc-no?Company_Code=${Company_Code}&Year_Code=${Year_Code}`;
        const response = await axios.post(apiUrl, {
          saleids: selectedSaleIds,
        });
        setSnackbarMessage("Sale Bill Number updated successfully!");
        setOpenSnackbar(true);
        setLoading(false);
        setSelectedSaleIds([]);
      } catch (error) {
        setSnackbarMessage("Failed to update Sale Bill Number");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    } else {
      setSnackbarMessage("Please Select the SaleID!");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  //Calculate the Taxable Amount on enter the vehicle number Function.
  const handleVehicleNumberChange = (e) => {
    const enteredVehicleNumber = e.target.value.toUpperCase();
    setVehicleNumber(enteredVehicleNumber);

    const total = filteredData
      .filter((row) => row.vehno.toUpperCase() === enteredVehicleNumber)
      .reduce((sum, row) => {
        const millAmount = isNaN(Number(row.MillAmount))
          ? 0
          : Number(row.MillAmount);
        console.log("MillAmount", millAmount);
        return sum + millAmount;
      }, 0);

    setMillAmount(total);
  };
  const formattedSubtotal =
    !isNaN(millAmount) && typeof millAmount === "number"
      ? millAmount.toFixed(2)
      : "0.00";

  // Filter data based on status
  const filterDataByStatus = (data) => {
    console.log("Filtering with status:", statusFilter);
    if (statusFilter === "All")
      return data.map((row) => ({
        ...row,
        isSelected: selectedSaleIds.includes(row.saleid),
      }));

    return data
      .filter((row) => {
        switch (statusFilter) {
          case "Pending":
            return (
              (!row.salebillno || row.salebillno === 0) &&
              (!row.saleewaybillno || row.saleewaybillno === "") &&
              row.ewbNo === "0"
            );
          case "To Be Generated":
            return (
              row.ewbNo &&
              row.ewbNo !== "0" &&
              (!row.salebillno || row.salebillno === 0) &&
              (!row.saleewaybillno || row.saleewaybillno === "")
            );
          case "eInvoice Pending":
            return row.salebillno !== 0 && row.saleewaybillno === "";
          case "Done":
            return row.salebillno !== 0 && row.saleewaybillno !== "";
          default:
            return true;
        }
      })
      .map((row) => ({
        ...row,
        isSelected: selectedSaleIds.includes(row.saleid),
      }));
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const sortedFilteredData = filterDataByStatus(filteredData).sort((a, b) => {
    const aPending =
      !a.salebillno ||
      a.salebillno === 0 ||
      !a.saleewaybillno ||
      a.saleewaybillno === 0;
    const bPending =
      !b.salebillno ||
      b.salebillno === 0 ||
      !b.saleewaybillno ||
      b.saleewaybillno === 0;

    if (aPending && !bPending) return -1;
    if (!aPending && bPending) return 1;
    return 0;
  });

  return (
    <div>
      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxHeight: "90%",
              overflow: "auto",
              backgroundColor: "white",
              padding: "20px",
              zIndex: 1000,
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          >
            <IconButton
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "gray",
              }}
            >
              <CloseIcon />
            </IconButton>
            <EWayBillNEInvoiceGen
              saleId={selectedSaleIdsEWayBillsEInvoice}
              handleClose={handleClose}
              vehicleNo={vehicleNo}
              doNo={doNo}
              fromDate={fromDate}
              ewayBillNo={ewayBillNo}
              millDoc_No={millDoc_No}
            />
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleClose}
          />
        </>
      )}

      {showEwayBillReport && (
        <EWayBillReport
          saleId={selectedSaleIdsEWayBills}
          ewayBillNo={ewayBillNo}
        />
      )}

      {saleBilReport && (
        <SaleBillReport
          saleId={selectedSaleIdsForSaleBill}
          ewayBillNo={ewayBillNo}
        />
      )}

      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >

        <Box sx={{ marginBottom: 2, ml: 3, width: 200 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              label="Status"
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="To Be Generated">To Be Generated</MenuItem>
              <MenuItem value="eInvoice Pending">eInvoice Pending</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>


        <Box sx={{ display: "flex", alignItems: "center", marginLeft: 1 }}>
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Enter Vehicle No:
          </Typography>
          <TextField
            id="vehicleNumber"
            value={vehicleNumber}
            onChange={handleVehicleNumberChange}
            variant="outlined"
            sx={{ width: "40%", marginRight: 2 }}
            size="small"
          />
          <Box>
            <Typography variant="h6" color="primary">
              {formattedSubtotal}
            </Typography>
          </Box>
        </Box>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Box
          sx={{
            marginBottom: 1,
            display: "flex",
            justifyContent: "flex-end",
            height: "5vh",
          }}
          mr={2}
          mb={2}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaleBillNo}
            disabled={selectedSaleIds.length === 0 || loading}
          >
            Generate SaleBill
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbarMessage.includes("successfully") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="600px"
        >
          <CircularSpinner />
        </Box>
      ) : filteredData.length === 0 ? (
        <NoDataAlert />
      ) : (
        <>
          <TableContainer
            component={Paper}
            style={{
              maxWidth: "98%",
              margin: "0 auto",
              height: "75vh",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={tableCellStyleHeader}>Status</TableCell>
                  <TableCell style={tableCellStyleHeader}>DO No</TableCell>
                  {/* <TableCell style={tableCellStyleHeader}>
                                        <TableSortLabel
                                            active={sortConfig.key === 'doc_no'}
                                            direction={sortConfig.key === 'doc_no' ? sortConfig.direction : 'asc'}
                                            onClick={() => handleSort('doc_no')}
                                        >
                                            Doc No
                                        </TableSortLabel>
                                    </TableCell> */}
                  <TableCell style={tableCellStyleHeader}>
                    Purc Gst No.
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    EwayBill Gst NO.
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Purc NET QNTL
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    EWay Bill NET QNTL
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>Quintal Diff</TableCell>
                  <TableCell style={tableCellStyleHeader}>Vehicle No</TableCell>
                  <TableCell style={tableCellStyleHeader}>Mill Name</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Purchase Bill To GST
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Purchase Bill To Name
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>To GSTIN</TableCell>
                  {/* <TableCell style={tableCellStyleHeader}>Purchase ID</TableCell> */}
                  <TableCell style={tableCellStyleHeader}>Mill Name</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Ship To Diff
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Ship To Pincode
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>Sub Total</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Taxable Amount
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Taxable Amt Diff
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>Mill Rate</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Mill Amount With TCS
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Purchase Tax Amount
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    EWay Bill Tax Amount
                  </TableCell>
                  {/* <TableCell style={tableCellStyleHeader}>Bill Diff</TableCell> */}
                  <TableCell style={tableCellStyleHeader}>Sale ID</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Sale Bill No
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Purc NET QNTL
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>Vehicle No</TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Generate Sale Bill
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Portal EWay Bill No
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Our EWay Bill No
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Generate Eway Bills
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    Sale Bill Print
                  </TableCell>
                  <TableCell style={tableCellStyleHeader}>
                    EWay Bill Print
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedFilteredData
                  .sort((a, b) => {
                    const aPending =
                      !a.salebillno ||
                      a.salebillno === 0 ||
                      !a.saleewaybillno ||
                      a.saleewaybillno === 0;
                    const bPending =
                      !b.salebillno ||
                      b.salebillno === 0 ||
                      !b.saleewaybillno ||
                      b.saleewaybillno === 0;

                    if (aPending && !bPending) return -1;
                    if (!aPending && bPending) return 1;
                    return 0;
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isMismatched =
                      row.Gst_No &&
                      row.EwayBillGSTN &&
                      row.Gst_No !== row.EwayBillGSTN;
                    const isVehicleMismatched =
                      row.vehno &&
                      row.EwaybillVehicleNo &&
                      row.vehno !== row.EwaybillVehicleNo;
                    return (
                      <TableRow key={index}>
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            color:
                              row.salebillno !== 0 && row.saleewaybillno === ""
                                ? "#FFFFFF"
                                : row.ewbNo &&
                                  row.ewbNo != 0 &&
                                  row.salebillno === 0
                                  ? "#e65100"
                                  : (!row.salebillno || row.salebillno === 0) &&
                                    (!row.saleewaybillno ||
                                      row.saleewaybillno === 0)
                                    ? "red"
                                    : "green",
                            fontWeight: "bold",
                            fontSize: "16px",
                            backgroundColor:
                              row.salebillno !== 0 && row.saleewaybillno === ""
                                ? "#4c84f4"
                                : row.ewbNo &&
                                  row.ewbNo != 0 &&
                                  row.salebillno === 0
                                  ? "#fff3cd"
                                  : (!row.salebillno || row.salebillno === 0) &&
                                    (!row.saleewaybillno ||
                                      row.saleewaybillno === 0)
                                    ? "#f8d7da"
                                    : "transparent",
                          }}
                        >
                          {row.salebillno !== 0 && row.saleewaybillno === ""
                            ? "eInvoice Pending"
                            : row.ewbNo &&
                              row.ewbNo != 0 &&
                              row.salebillno === 0
                              ? "To Be Generated"
                              : (!row.salebillno || row.salebillno === 0) &&
                                (!row.saleewaybillno || row.saleewaybillno === 0)
                                ? "Pending"
                                : "Done"}
                        </TableCell>

                        <TableCell style={tableCellStyle}>
                          {row.DO_No}
                        </TableCell>
                        {/* <TableCell style={tableCellStyle}>{row.doc_no}</TableCell> */}
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            position: "sticky",
                            backgroundColor: isMismatched
                              ? "#e68282"
                              : "inherit",
                          }}
                        >
                          {row.Gst_No}
                        </TableCell>
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            backgroundColor: isMismatched
                              ? "#e68282"
                              : "inherit",
                          }}
                        >
                          {row.EwayBillGSTN}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.NETQNTL}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.EwayBillQuantity}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.qtyDiff}
                        </TableCell>
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            backgroundColor: isVehicleMismatched
                              ? "#f8d7da"
                              : "inherit",
                          }}
                        >
                          {row.vehno}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.millname}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.billtogst}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.billtoname}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.toGSTIN}
                        </TableCell>
                        {/* <TableCell style={tableCellStyle}>{row.purchaseid}</TableCell> */}
                        <TableCell style={tableCellStyle}>
                          {row.purcname}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.shipToDiff}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.shiptopin}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {formatReadableAmount(row.subTotal)}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {formatReadableAmount(row.taxableAmount)}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.taxableAmtDiff}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {formatReadableAmount(row.MillRate)}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {formatReadableAmount(row.MillAmountWithTCS || 0)}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {formatReadableAmount(row.MillAmount)}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.PoratalInval}
                        </TableCell>

                        {/* <TableCell style={tableCellStyle}>{row.TotalInvval}</TableCell> */}
                        <TableCell style={tableCellStyle}>
                          {row.saleid}
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.salebillno}
                        </TableCell>
                          <TableCell style={tableCellStyle}>
                          {row.NETQNTL}
                        </TableCell>
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            backgroundColor: isVehicleMismatched
                              ? "#f8d7da"
                              : "inherit",
                          }}
                        >
                          {row.vehno}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={row.isSelected || false}
                            onChange={(e) =>
                              handleCheckboxChange(
                                index,
                                e.target.checked,
                                row.saleid
                              )
                            }
                            disabled={
                              row.salebillno !== 0 && row.salebillno != null
                            }
                          />
                        </TableCell>
                        <TableCell style={tableCellStyle}>
                          {row.ewbNo}
                        </TableCell>
                        <TableCell
                          style={{
                            ...tableCellStyle,
                            position: "sticky",
                            backgroundColor:
                              row.saleewaybillno === null ||
                                row.saleewaybillno === ""
                                ? "#e68282"
                                : "inherit",
                          }}
                        >
                          {row.saleewaybillno}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleGenerate(row, "Eway Bill")}
                            disabled={
                              !(
                                row.salebillno !== 0 &&
                                row.salebillno != null &&
                                row.saleewaybillno === ""
                              )
                            }
                          >
                            Generate
                          </Button>
                        </TableCell>
                        <TableCell>
                          <PrintButton
                            onClick={() =>
                              handleSaleBillPrint(row, "Sale Report")
                            }
                            disabled={
                              !(row.salebillno !== 0 && row.salebillno != null)
                            }
                            buttonColor={
                              row.SaleBill_Print === "Y" ? "green" : "#3b82f6"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <PrintButton
                            onClick={() =>
                              handleEWayBillPrint(row, "EWayBill Report")
                            }
                            disabled={row.saleewaybillno === ""}
                            buttonColor={
                              row.EWayBill_Print === "Y" ? "green" : "#3b82f6"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[100, 200, 300, 500]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default GenerateEwayBill;
