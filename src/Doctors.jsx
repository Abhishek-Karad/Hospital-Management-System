import { useState, useEffect } from "react";
import axios from "axios";
import "./css/doc.css";

function AddEditDoc({ fetchDoctors, editingDoc, setEditingDoc }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cabin_no: "",
    specialization: "",
    start_time: "",
    end_time: "",
    profile_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (editingDoc) setFormData(editingDoc);
  }, [editingDoc]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (editingDoc) {
        // Edit doctor
        await axios.put(`http://localhost:3001/doctors/${editingDoc.id}`, formData);
        setMessage({ text: "✅ Doctor updated successfully!", type: "success" });
      } else {
        // Add doctor
        await axios.post("http://localhost:3001/doctors", formData);
        setMessage({ text: "✅ Doctor added successfully!", type: "success" });
      }
      setFormData({
        name: "",
        phone: "",
        address: "",
        cabin_no: "",
        specialization: "",
        start_time: "",
        end_time: "",
        profile_url: "",
      });
      setEditingDoc(null);
      fetchDoctors();
    } catch (err) {
      console.error(err.response || err);
      setMessage({ text: "❌ Failed to save doctor.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-edit-doctor">
      <h2>{editingDoc ? "Edit Doctor" : "Add New Doctor"}</h2>
      <form onSubmit={handleSubmit} className="doctor-form">
        <input type="text" name="name" placeholder="Doctor Name" value={formData.name} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="cabin_no" placeholder="Cabin Number" value={formData.cabin_no} onChange={handleChange} />
        <select name="specialization" value={formData.specialization} onChange={handleChange} required>
          <option value="">-- Select Specialization --</option>
          <option value="general">General Physician</option>
          <option value="cardiology">Cardiologist</option>
          <option value="neurology">Neurologist</option>
          <option value="orthopedics">Orthopedic Surgeon</option>
          <option value="pediatrics">Pediatrician</option>
          <option value="gynecology">Gynecologist</option>
          <option value="dermatology">Dermatologist</option>
          <option value="psychiatry">Psychiatrist</option>
          <option value="oncology">Oncologist</option>
        </select>
        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
        <input type="url" name="profile_url" placeholder="Profile Image URL" value={formData.profile_url} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Saving..." : editingDoc ? "Update Doctor" : "Add Doctor"}</button>
        {message.text && <p className={message.type === "success" ? "success-msg" : "error-msg"}>{message.text}</p>}
      </form>
    </section>
  );
}

function DoctorCard({ doctor, onEdit, onDelete }) {
  return (
    <div className="doctor-card">
      <img src={doctor.profile_url || "https://via.placeholder.com/100"} alt={doctor.name} className="doctor-img" />
      <div className="doctor-info">
        <h3>{doctor.name}</h3>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Time:</strong> {doctor.start_time} - {doctor.end_time}</p>
        <p><strong>Phone:</strong> {doctor.phone}</p>
        <p><strong>Cabin:</strong> {doctor.cabin_no}</p>
      </div>
      <div className="doctor-actions">
        <button onClick={() => onEdit(doctor)}>Edit</button>
        <button onClick={() => onDelete(doctor.id)}>Delete</button>
      </div>
    </div>
  );
}

export function Doctorlist() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoc, setEditingDoc] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:3001/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  return (
    <div className="doctor-page">
      <h1 className="page-title">Doctors Management</h1>
      <div className="doctor-container">
        <AddEditDoc fetchDoctors={fetchDoctors} editingDoc={editingDoc} setEditingDoc={setEditingDoc} />
        <section className="doctor-list-cards">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onEdit={setEditingDoc} onDelete={handleDelete} />
          ))}
        </section>
      </div>
    </div>
  );
}
