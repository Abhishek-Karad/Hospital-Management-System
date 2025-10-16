import { Link } from "react-router-dom";
import "./css/home.css";

export function Home() {
  return (
    <div className="home-page">
      <section className="home-cover">
        <div className="home-overlay">
          <div className="home-content">
            <h1 className="home-title">
              Welcome to <span>Hospital Management System</span>
            </h1>
            <p className="home-subtitle">
              Streamline appointments, manage doctors and patients, and track finances — all in one modern dashboard.
            </p>

            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                to="/booking"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Book Appointment
              </Link>

              <Link
                to="/doctors"
                style={{
                  background: "#111827",
                  color: "#facc15",
                  padding: "12px 20px",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                Browse Doctors
              </Link>

              <Link
                to="/sales"
                style={{
                  background: "#10b981",
                  color: "#ffffff",
                  padding: "12px 20px",
                  borderRadius: 8,
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                View Financials
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        © {new Date().getFullYear()} <strong>Hospital Management System</strong>.Made by Abhishek Karad
      </footer>
    </div>
  );
}


