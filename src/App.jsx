import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./navbar";
import { Home } from "./Home";
import { Appointment } from "./appointment";
import { Doctorlist } from "./Doctors";
import { Dashboard } from "./sales";
import "./css/App.css"; // global styles

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Appointment />} />
            <Route path="/doctors" element={<Doctorlist />} />
            <Route path="/sales" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
