import React, { useEffect, useState } from "react";
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
import API from "../api/axios";

const PartnerOnboarding = () => {
  /* Form State */
  const [formData, setFormData] = useState({
    // Step 1
    restaurantName: "",
    brandName: "",
    restaurantType: "Dine-in",
    avgCost: "",
    cuisines: [] as string[],
    description: "",
    // Step 2
    address: "",
    city: "",
    state: "",
    zip: "",
    ownerName: "",
    mobile: "",
    email: "",
    // Step 3
    openingTime: "",
    closingTime: "",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    // Step 4
    fssai: null,
    pan: null,
    // Step 5
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountHolderName: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "workingDays") {
      // Handle working days array if needed, purely visual for now
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1: // details
        return (
          formData.restaurantName.trim() !== "" &&
          formData.avgCost.trim() !== "" &&
          formData.description.trim() !== ""
        );
      case 2: // location
        return (
          formData.address.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.state.trim() !== "" &&
          formData.zip.trim() !== "" &&
          formData.ownerName.trim() !== "" &&
          formData.mobile.trim() !== "" &&
          formData.email.trim() !== ""
        );
      case 3: // operational
        return formData.openingTime !== "" && formData.closingTime !== "";
      case 4: // documents
        return false; // Mock
      case 5: // bank
        return (
          formData.accountNumber.trim() !== "" &&
          formData.ifscCode.trim() !== "" &&
          formData.bankName.trim() !== "" &&
          formData.accountHolderName.trim() !== ""
        );
      default:
        return false;
    }
  };

  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: "Restaurant Details", icon: Store },
    { id: 2, label: "Location & Contact", icon: MapPin },
    { id: 3, label: "Operational Details", icon: Clock },
    { id: 4, label: "Documents", icon: FileText },
    { id: 5, label: "Bank Details", icon: CreditCard },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          const sectionId = visibleSection.target.id;
          const step = steps.find((s) => getSectionId(s.id) === sectionId);
          if (step) {
            setActiveStep(step.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll(".form-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/restaurants/onboard", formData);
      setShowModal(false);
      alert(
        "The request has the sent to quickmato, you will be contacted by our Buisness team shortly."
      );
      // Optional: Redirect or Reset
      window.location.href = "/";
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  const scrollToSection = (id: string, stepId: number) => {
    if (stepId === 6) {
      setShowModal(true);
      return;
    }
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
            {steps.map((step) => {
              const completed = isStepComplete(step.id);
              return (
                <li
                  key={step.id}
                  className={`step-item ${
                    activeStep === step.id ? "active" : ""
                  } ${completed ? "completed" : ""}`}
                  onClick={() =>
                    scrollToSection(getSectionId(step.id), step.id)
                  }
                >
                  <div className="step-number">
                    {completed ? <Check size={14} /> : step.id}
                  </div>
                  <span>{step.label}</span>
                </li>
              );
            })}
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
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="e.g. Spice Garden"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand Name (If different)</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="e.g. SG Foods Pvt Ltd"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Restaurant Type</label>
                <select
                  className="partner-form-select"
                  name="restaurantType"
                  value={formData.restaurantType}
                  onChange={handleChange}
                >
                  <option>Dine-in</option>
                  <option>Delivery Only</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Avg Cost for Two</label>
                <input
                  type="text"
                  name="avgCost"
                  value={formData.avgCost}
                  onChange={handleChange}
                  className="partner-form-input"
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
                  className="partner-form-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
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
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="Shop No, Street, Area"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="City"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="State"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="partner-form-input"
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
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="input-with-btn">
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="partner-form-input"
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="partner-form-input"
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
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="partner-form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className="partner-form-input"
                />
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

          {/* 5. Bank Details */}
          <section id="bank-section" className="form-section">
            <div className="section-header">
              <div className="section-number">5</div>
              <h2 className="section-title">Bank Details</h2>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="Enter Account Number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="IFSC Code"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="Bank Name"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="partner-form-input"
                  placeholder="Account Holder Name"
                />
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
          <button className="btn-secondary" onClick={() => setShowModal(true)}>
            Review
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Submit Application
          </button>
        </div>
      </footer>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>Review Your Application</h2>

            <ReviewSection
              title="Restaurant Details"
              data={{
                Name: formData.restaurantName,
                Brand: formData.brandName,
                Type: formData.restaurantType,
                Cost: formData.avgCost,
                Description: formData.description,
              }}
            />

            <ReviewSection
              title="Location & Contact"
              data={{
                Address: formData.address,
                City: formData.city,
                State: formData.state,
                Zip: formData.zip,
                Owner: formData.ownerName,
                Mobile: formData.mobile,
                Email: formData.email,
              }}
            />

            <ReviewSection
              title="Operational Details"
              data={{
                "Opening Time": formData.openingTime,
                "Closing Time": formData.closingTime,
              }}
            />

            <ReviewSection
              title="Bank Details"
              data={{
                Account: formData.accountNumber,
                IFSC: formData.ifscCode,
                Bank: formData.bankName,
                Holder: formData.accountHolderName,
              }}
            />

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Edit
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ title, data }: { title: string; data: any }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h3
      style={{
        fontSize: "1.1rem",
        marginBottom: "0.5rem",
        color: "#333",
        borderBottom: "1px solid #eee",
        paddingBottom: "0.2rem",
      }}
    >
      {title}
    </h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.5rem",
        fontSize: "0.9rem",
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <React.Fragment key={key}>
          <span style={{ color: "#666" }}>{key}:</span>
          <span style={{ fontWeight: "500" }}>
            {(value as React.ReactNode) || "-"}
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

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
      return "bank-section";
    case 6:
      return "documents-section"; // Fallback as it's a modal
    default:
      return "details-section";
  }
};

export default PartnerOnboarding;
