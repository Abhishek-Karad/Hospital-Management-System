import { Link } from "react-router-dom";
import "./css//Navbar.css"; // import CSS file

export function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">My Healthcare System</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/booking">Appointments</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/sales">Financial Dashboard</Link>
      </div>
    </nav>
  );
}
