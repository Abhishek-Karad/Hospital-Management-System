import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  LocalHospital as HospitalIcon,
  AccountBalance as BankIcon,
  Assessment as ChartIcon,
  Schedule as ScheduleIcon,
  CurrencyRupee as RupeeIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// Mock data for demonstration
const mockData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
    { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
    { month: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 }
  ],
  appointmentEarnings: [
    { doctor: 'Dr. Smith', specialization: 'Cardiology', patients: 45, earnings: 22500 },
    { doctor: 'Dr. Johnson', specialization: 'Neurology', patients: 38, earnings: 19000 },
    { doctor: 'Dr. Williams', specialization: 'Orthopedics', patients: 42, earnings: 21000 },
    { doctor: 'Dr. Brown', specialization: 'Pediatrics', patients: 35, earnings: 17500 },
    { doctor: 'Dr. Davis', specialization: 'Dermatology', patients: 28, earnings: 14000 }
  ],
  expenses: [
    { category: 'Staff Salaries', amount: 25000, percentage: 45 },
    { category: 'Medical Supplies', amount: 8000, percentage: 14 },
    { category: 'Equipment Maintenance', amount: 5000, percentage: 9 },
    { category: 'Utilities', amount: 3000, percentage: 5 },
    { category: 'Insurance', amount: 4000, percentage: 7 },
    { category: 'Other', amount: 5000, percentage: 9 }
  ],
  recentTransactions: [
    { id: 1, type: 'Appointment', patient: 'John Doe', amount: 500, date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Salary', employee: 'Dr. Smith', amount: 8000, date: '2024-01-14', status: 'Paid' },
    { id: 3, type: 'Expense', description: 'Medical Supplies', amount: 1200, date: '2024-01-13', status: 'Processed' },
    { id: 4, type: 'Appointment', patient: 'Jane Smith', amount: 350, date: '2024-01-12', status: 'Completed' },
    { id: 5, type: 'Appointment', patient: 'Mike Johnson', amount: 600, date: '2024-01-11', status: 'Completed' }
  ]
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

// Indian currency formatting
const formatIndianCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Indian number formatting with lakhs and crores
const formatIndianNumber = (num) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export function Dashboard() {
  const [data, setData] = useState({
    monthlyRevenue: [],
    appointmentEarnings: [],
    expenses: [],
    recentTransactions: []
  });
  const [financialSummary, setFinancialSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalSalary: 0,
    totalAppointments: 0,
    netProfit: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Fetch financial data from backend
  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const [dashboardResponse, summaryResponse, doctorsResponse, patientsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/financial-dashboard`),
        axios.get(`${API_BASE_URL}/financial-summary`),
        axios.get(`${API_BASE_URL}/doctors`),
        axios.get(`${API_BASE_URL}/patients`)
      ]);

      // Transform the data to match the expected format
      const transformedData = {
        monthlyRevenue: dashboardResponse.data.monthlyRevenue.map(item => ({
          month: item.month,
          revenue: parseFloat(item.revenue) || 0,
          expenses: 0, // Will be populated from expenses data
          profit: parseFloat(item.revenue) || 0
        })),
        appointmentEarnings: dashboardResponse.data.appointmentEarnings.map(item => ({
          doctor: item.Doctor?.name || 'Unknown Doctor',
          specialization: item.Doctor?.specialization || 'General',
          patients: parseInt(item.patients) || 0,
          earnings: parseFloat(item.earnings) || 0
        })),
        expenses: dashboardResponse.data.expenseDistribution.map(item => ({
          category: item.category,
          amount: parseFloat(item.amount) || 0,
          percentage: 0 // Will be calculated
        })),
        recentTransactions: dashboardResponse.data.recentTransactions.map(item => ({
          id: item.id,
          type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          patient: item.Patient?.name || item.description,
          employee: item.Doctor?.name,
          description: item.description,
          amount: parseFloat(item.amount) || 0,
          date: item.date,
          status: item.status.charAt(0).toUpperCase() + item.status.slice(1)
        }))
      };

      // Calculate percentages for expenses
      const totalExpenseAmount = transformedData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      transformedData.expenses = transformedData.expenses.map(exp => ({
        ...exp,
        percentage: totalExpenseAmount > 0 ? Math.round((exp.amount / totalExpenseAmount) * 100) : 0
      }));

      setData(transformedData);
      setFinancialSummary(summaryResponse.data);
      setDoctors(doctorsResponse.data);
      setPatients(patientsResponse.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      // Fallback to mock data if backend is not available
      setData(mockData);
      setFinancialSummary({
        totalRevenue: 328000,
        totalExpenses: 214000,
        totalSalary: 150000,
        totalAppointments: 188,
        netProfit: 114000
      });
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = financialSummary.totalRevenue;
  const totalExpenses = financialSummary.totalExpenses + financialSummary.totalSalary;
  const totalProfit = financialSummary.netProfit;
  const totalAppointments = financialSummary.totalAppointments;

  const handleAddTransaction = () => {
    setDialogType('transaction');
    setFormData({});
    setOpenDialog(true);
  };

  const handleAddExpense = () => {
    setDialogType('expense');
    setFormData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      const transactionData = {
        type: formData.type.toLowerCase(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        status: 'completed',
        category: formData.type === 'expense' ? 'General' : null
      };

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      await axios.post(`${API_BASE_URL}/financial-transactions`, transactionData);
      
      // Refresh data after saving
      await fetchFinancialData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            Loading financial data...
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            mr: 2,
            width: 64,
            height: 64
          }}>
            <BankIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Financial Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Hospital Revenue & Expense Management System
            </Typography>
          </Box>
        </Box>
        
        {/* Tabs for different views */}
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab icon={<ChartIcon />} label="Overview" />
          <Tab icon={<TimelineIcon />} label="Analytics" />
          <Tab icon={<ReceiptIcon />} label="Transactions" />
          <Tab icon={<BusinessIcon />} label="Reports" />
        </Tabs>
      </Box>

      {/* Overview Tab Content */}
      {selectedTab === 0 && (
        <>
          {/* Key Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {formatIndianCurrency(totalRevenue)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {formatIndianNumber(totalRevenue)} INR
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <RupeeIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4ECDC4 0%, #6ED5CD 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(78, 205, 196, 0.3)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Total Expenses
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {formatIndianCurrency(totalExpenses)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {formatIndianNumber(totalExpenses)} INR
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <ReceiptIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #45B7D1 0%, #6BC5D8 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(69, 183, 209, 0.3)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Net Profit
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {formatIndianCurrency(totalProfit)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {formatIndianNumber(totalProfit)} INR
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <TrendingUpIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #96CEB4 0%, #A8D8B4 100%)', 
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(150, 206, 180, 0.3)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Total Appointments
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {totalAppointments}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Patients Served
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                      <PeopleIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Hospital Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <HospitalIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Hospital Statistics
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Doctors:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doctors.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Patients:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{patients.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Avg. Revenue/Patient:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {patients.length > 0 ? formatIndianCurrency(totalRevenue / patients.length) : '₹0'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Recent Activity
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {data.recentTransactions.slice(0, 5).map((transaction, index) => (
                      <Box key={transaction.id} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: index < 4 ? '1px solid' : 'none',
                        borderColor: 'grey.200'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 2,
                            bgcolor: transaction.type === 'Appointment' ? 'success.main' : 
                                   transaction.type === 'Salary' ? 'warning.main' : 'error.main'
                          }}>
                            {transaction.type.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {transaction.patient || transaction.employee || transaction.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          color: transaction.amount > 0 ? 'success.main' : 'error.main'
                        }}>
                          {formatIndianCurrency(transaction.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Analytics Tab Content */}
      {selectedTab === 1 && (
        <>
          {/* Revenue vs Expenses Chart */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Revenue vs Expenses Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatIndianNumber(value)} />
                      <Tooltip formatter={(value) => [formatIndianCurrency(value), '']} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" name="Revenue" />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#4ECDC4" fill="#4ECDC4" name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Expense Distribution Pie Chart */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <ChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Expense Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.expenses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {data.expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatIndianCurrency(value), '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Doctor Earnings Chart */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Doctor Earnings by Specialization
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.appointmentEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="specialization" />
                      <YAxis tickFormatter={(value) => formatIndianNumber(value)} />
                      <Tooltip formatter={(value) => [formatIndianCurrency(value), '']} />
                      <Legend />
                      <Bar dataKey="earnings" fill="#45B7D1" name="Earnings" />
                      <Bar dataKey="patients" fill="#96CEB4" name="Patients" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Transactions Tab Content */}
      {selectedTab === 2 && (
        <>
          {/* Action Buttons */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTransaction}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600
              }}
            >
              Add Transaction
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddExpense}
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600
              }}
            >
              Add Expense
            </Button>
          </Box>

          {/* Recent Transactions Table */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'Appointment' ? 'success' : transaction.type === 'Salary' ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 2,
                              bgcolor: transaction.type === 'Appointment' ? 'success.main' : 
                                     transaction.type === 'Salary' ? 'warning.main' : 'error.main'
                            }}>
                              {transaction.type.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {transaction.patient || transaction.employee || transaction.description}
                              </Typography>
                              {transaction.employee && (
                                <Typography variant="caption" color="text.secondary">
                                  Dr. {transaction.employee}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 'bold', 
                            color: transaction.amount > 0 ? 'success.main' : 'error.main',
                            fontSize: '1.1rem'
                          }}>
                            {formatIndianCurrency(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status}
                            color={transaction.status === 'Completed' || transaction.status === 'Paid' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Reports Tab Content */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Financial Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Revenue:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatIndianCurrency(totalRevenue)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Expenses:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {formatIndianCurrency(totalExpenses)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Net Profit:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: totalProfit > 0 ? 'success.main' : 'error.main' }}>
                      {formatIndianCurrency(totalProfit)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Profit Margin:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Hospital Performance
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Doctors:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {doctors.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Patients:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {patients.length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Total Appointments:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {totalAppointments}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Avg. Revenue per Patient:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {patients.length > 0 ? formatIndianCurrency(totalRevenue / patients.length) : '₹0'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}


      {/* Add Transaction/Expense Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          {dialogType === 'transaction' ? 'Add New Transaction' : 'Add New Expense'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Appointment">Appointment</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{
                startAdornment: <RupeeIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
              sx={{ borderRadius: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600
            }}
          >
            Save Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
