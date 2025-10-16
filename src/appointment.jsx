import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalHospital as HospitalIcon,
  Add as AddIcon
} from '@mui/icons-material';

// ---------------- Book Appointment Form ----------------
export function BookAppointment({ doctors, onAppointmentBooked }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patientResponse = await axios.post(
        `http://localhost:3001/doctors/${formData.doctorId}/patients`,
        {
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          disease: formData.reason,
          appointment_date: formData.date,
          appointment_time: formData.time,
          doctorId: formData.doctorId,
        }
      );

      // Create financial transaction for the appointment
      const appointmentFee = 500; // Default appointment fee
      await axios.post('http://localhost:3001/financial-transactions', {
        type: 'appointment',
        description: `Appointment with ${formData.name}`,
        amount: appointmentFee,
        date: formData.date,
        status: 'completed',
        patient_id: patientResponse.data.id,
        doctor_id: formData.doctorId,
        category: 'Appointment'
      });

      alert(" Appointment booked successfully!");
      setFormData({
        name: "",
        age: "",
        phone: "",
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
      onAppointmentBooked();
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert(" Failed to book appointment.");
    }
  };

  return (
    <Card sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      mb: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            mr: 2,
            width: 48,
            height: 48
          }}>
            <HospitalIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Book New Appointment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schedule your medical consultation
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Patient Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Patient Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            {/* Appointment Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600, mt: 2 }}>
                Appointment Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  label="Select Doctor"
                  sx={{
                    borderRadius: 2
                  }}
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light' }}>
                          {doc.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.specialization}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reason for Visit"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Describe your symptoms or reason for consultation"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Appointment Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preferred Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <TimeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  Book Appointment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

// ---------------- Appointment Dashboard ----------------
export function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/doctors");
      setDoctors(res.data);
      res.data.forEach((doc) => fetchPatientsByDoctor(doc.id));
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsByDoctor = async (doctorId) => {
    try {
      const res = await axios.get(`http://localhost:3001/doctors/${doctorId}/patients`);
      setPatients((prev) => ({ ...prev, [doctorId]: res.data }));
    } catch (err) {
      console.error(`Error fetching patients for doctor ${doctorId}:`, err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          mb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Appointment Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Schedule and manage patient appointments
        </Typography>
      </Box>

      <BookAppointment doctors={doctors} onAppointmentBooked={fetchDoctors} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Loading doctors...
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center'
          }}>
            <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
            Today's Appointments
          </Typography>
          
          <Grid container spacing={3}>
            {doctors.map((doc) => {
              const docPatients = patients[doc.id] || [];
              return (
                <Grid item xs={12} md={6} lg={4} key={doc.id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      {/* Doctor Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ 
                          width: 56, 
                          height: 56, 
                          mr: 2, 
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {doc.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary',
                            mb: 0.5
                          }}>
                            {doc.name}
                          </Typography>
                          <Chip 
                            label={doc.specialization} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                      </Box>

                      {/* Doctor Details */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Duty Hours:</strong> {doc.start_time} – {doc.end_time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cabin:</strong> {doc.cabin_no}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Appointments Count */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 2
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: 'primary.main' 
                        }}>
                          Today's Appointments
                        </Typography>
                        <Chip 
                          label={docPatients.length} 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}
                        />
                      </Box>

                      {/* Patient List */}
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        maxHeight: 200,
                        overflow: 'auto'
                      }}>
                        {docPatients.length > 0 ? (
                          <Box>
                            {docPatients.map((p, index) => (
                              <Box key={p.id} sx={{ 
                                mb: index < docPatients.length - 1 ? 2 : 0,
                                p: 1.5,
                                bgcolor: 'white',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.200'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Avatar sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    mr: 1.5, 
                                    bgcolor: 'secondary.main',
                                    fontSize: '0.875rem'
                                  }}>
                                    {p.name.charAt(0)}
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {p.name} ({p.age} yrs)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {p.phone}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  fontStyle: 'italic',
                                  ml: 4.5
                                }}>
                                  {p.disease} @ {p.appointment_time}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ 
                            textAlign: 'center', 
                            py: 3,
                            color: 'text.secondary'
                          }}>
                            <Typography variant="body2">
                              No appointments scheduled for today
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

