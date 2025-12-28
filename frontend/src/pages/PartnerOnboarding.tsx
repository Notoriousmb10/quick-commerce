import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PartnerOnboarding.css";
// Using lucide-react which is already in the project
import {
  Check,
  Store,
  MapPin,
  Clock,
  FileText,
  CreditCard,
  Send,
  Upload,
} from "lucide-react";
// Import chef image or use fallback
// Assuming we don't have the specific chef image yet, I'll use a placeholder or reference one if available.
// For now, I'll use a placeholder URL from unsplash or similar if I don't have the asset.

const PartnerOnboarding = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: "Restaurant Details", icon: Store },
    { id: 2, label: "Location & Contact", icon: MapPin },
    { id: 3, label: "Operational Details", icon: Clock },
    { id: 4, label: "Documents", icon: FileText },
    { id: 5, label: "Bank Details", icon: CreditCard },
    { id: 6, label: "Review & Submit", icon: Send },
  ];

  const scrollToSection = (id: string, stepId: number) => {
    setActiveStep(stepId);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="onboarding-container">
      {/* Header */}
      <header className="onboarding-header">
        <div className="onboarding-logo">
          <div
            style={{
              background: "#ff5200",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold" }}>⚡</span>
          </div>
          <span>QuickMato</span> Partner
        </div>
        <div>
          <span className="login-link">Already registered?</span>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>
            Grow Your Restaurant with <span>QuickMato</span>
          </h1>
          <p className="hero-subtext">
            Reach thousands of hungry customers, streamline your delivery, and
            increase your daily orders with our partner program.
          </p>
          <button
            className="cta-btn"
            onClick={() => scrollToSection("details-section", 1)}
          >
            List Your Restaurant
          </button>
        </div>
        <div className="hero-image">
          {/* Placeholder for the chef image from valid source or asset */}
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80"
            alt="Chef"
            className="hero-chef-img"
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="onboarding-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="progress-steps">
            {steps.map((step) => (
              <li
                key={step.id}
                className={`step-item ${
                  activeStep === step.id ? "active" : ""
                } ${activeStep > step.id ? "completed" : ""}`}
                onClick={() => scrollToSection(getSectionId(step.id), step.id)}
              >
                <div className="step-number">
                  {activeStep > step.id ? <Check size={14} /> : step.id}
                </div>
                <span>{step.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Forms */}
        <div className="form-container">
          {/* 1. Restaurant Details */}
          <section id="details-section" className="form-section">
            <div className="section-header">
              <div className="section-number">1</div>
              <h2 className="section-title">Restaurant Details</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Spice Garden"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand Name (If different)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SG Foods Pvt Ltd"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Restaurant Type</label>
                <select className="form-select">
                  <option>Dine-in</option>
                  <option>Delivery Only</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Avg Cost for Two</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹500"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Cuisines</label>
                <div className="checkbox-group">
                  {[
                    "North Indian",
                    "Chinese",
                    "Italian",
                    "Fast Food",
                    "South Indian",
                    "Desserts",
                  ].map((c) => (
                    <label key={c} className="checkbox-label">
                      <input type="checkbox" className="checkbox-input" /> {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us about your food and story..."
                ></textarea>
              </div>
            </div>
          </section>

          {/* 2. Location & Contact */}
          <section id="location-section" className="form-section">
            <div className="section-header">
              <div className="section-number">2</div>
              <h2 className="section-title">Location & Contact</h2>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Restaurant Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Shop No, Street, Area"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-input" placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" className="form-input" placeholder="State" />
              </div>
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Zip Code"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Pin Location on Map</label>
                <div className="map-placeholder">Map Component Placeholder</div>
              </div>

              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-with-btn">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 1234567890"
                    style={{ flex: 1 }}
                  />
                  <button className="verify-btn">Verify</button>
                </div>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="partner@restaurant.com"
                />
              </div>
            </div>
          </section>

          {/* 3. Operational Details */}
          <section id="operational-section" className="form-section">
            <div className="section-header">
              <div className="section-number">3</div>
              <h2 className="section-title">Operational Details</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Opening Time</label>
                <input type="time" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Closing Time</label>
                <input type="time" className="form-input" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Working Days</label>
                <div className="checkbox-group">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <label key={d} className="checkbox-label">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          defaultChecked
                        />{" "}
                        {d}
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 4. Documents */}
          <section id="documents-section" className="form-section">
            <div className="section-header">
              <div className="section-number">4</div>
              <h2 className="section-title">Documents & Compliance</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">FSSAI License</label>
                <div className="upload-box">
                  <Upload
                    size={24}
                    color="#888"
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <div className="upload-text">
                    Click to upload or drag & drop
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#999" }}>
                    PDF, JPG (Max 5MB)
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">PAN Card</label>
                <div className="upload-box">
                  <Upload
                    size={24}
                    color="#888"
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <div className="upload-text">
                    Click to upload or drag & drop
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#999" }}>
                    JPG, PNG (Max 2MB)
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="onboarding-footer">
        <span className="footer-secure">
          Your data is encrypted and secure.
        </span>
        <div className="footer-actions">
          <button className="btn-secondary">Save & Exit</button>
          <button className="btn-submit">Submit Application</button>
        </div>
      </footer>
    </div>
  );
};

// Helper to map ids
const getSectionId = (id: number) => {
  switch (id) {
    case 1:
      return "details-section";
    case 2:
      return "location-section";
    case 3:
      return "operational-section";
    case 4:
      return "documents-section";
    case 5:
      return "documents-section"; // Placeholder
    case 6:
      return "documents-section"; // Placeholder
    default:
      return "details-section";
  }
};

export default PartnerOnboarding;
