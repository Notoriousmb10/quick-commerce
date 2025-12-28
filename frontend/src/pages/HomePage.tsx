import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  ArrowRight,
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import "./HomePage.css";
import DeliveryRider from "../assets/DeliveryPartner.png";
import FoodDeliveryPartner from "../assets/DeliveryPartnerFood.png";
import QuickMatoApp from "../assets/MobileApp.png";
import ForRestaurants from "../assets/ForRestaurants.webp";
import ForRiders from "../assets/ForRiders.webp";
const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");

  const categories = [
    {
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
      count: "50+ Places",
    },
    {
      name: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      count: "35+ Places",
    },
    {
      name: "Biryani",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80",
      count: "20+ Places",
    },
    {
      name: "Dessert",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
      count: "40+ Places",
    },
    {
      name: "South Indian",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      count: "25+ Places",
    },
    {
      name: "Chinese",
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80",
      count: "30+ Places",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Favorite Food, <br />
            <span style={{ color: "var(--primary)" }}>
              Delivered in Minutes
            </span>
          </h1>
          <p className="hero-subtitle">
            Order from 500+ top restaurants near you. Very Light/Dark option.
            Fresh, hot, and tasty.
          </p>

          <div className="hero-search-wrapper">
            <div className="hero-search-input-container">
              <MapPin size={20} color="var(--primary)" />
              <input
                type="text"
                placeholder="Enter your delivery location"
                className="hero-search-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="btn-primary">Find Food</button>
          </div>

          <p className="hero-partner-link">
            Or <Link to="/partner">Become a Partner</Link>
          </p>
        </div>

        <div className="hero-image-container">
          <img
            src={DeliveryRider}
            alt="Delivery Rider"
            className="hero-image"
          />
        </div>
      </section>

      {/* How QuickMato Works */}
      <section className="section works-section">
        <div className="section-header" style={{ textAlign: "center" }}>
          <h2 className="section-title">How QuickMato Works</h2>
          <p className="section-subtitle">
            Get your favorite meals in 3 simple steps
          </p>
        </div>

        <div className="works-grid">
          <div className="work-card">
            <div className="work-icon-wrapper">
              <MapPin size={32} color="var(--primary)" />
            </div>
            <h3 className="work-title">Choose Restaurant</h3>
            <p className="work-desc">
              Browse hundreds of menus to find the food you like
            </p>
          </div>
          <div className="work-card">
            <div className="work-icon-wrapper">
              <CreditCard size={32} color="var(--primary)" />
            </div>
            <h3 className="work-title">Order Online</h3>
            <p className="work-desc">
              It's quick, safe, and easy. Pay online or cash on delivery
            </p>
          </div>
          <div className="work-card">
            <div className="work-icon-wrapper">
              <Clock size={32} color="var(--primary)" />
            </div>
            <h3 className="work-title">Fast Delivery</h3>
            <p className="work-desc">
              Food is prepared & delivered to your door in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Explore our wide range of foods</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="category-card">
              <img src={cat.image} alt={cat.name} className="category-img" />
              <div className="category-overlay">
                <div className="category-name">{cat.name}</div>
                <div className="category-items-count">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="features-container">
          <div className="features-content">
            <h2 className="section-title">Why Choose QuickMato?</h2>
            <p className="section-subtitle">
              We are more than just food delivery. We are here to simplify your
              life.
            </p>

            <div className="feature-list">
              <div className="feature-item ">
                <div className="feature-icon-box">
                  <Clock color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 className="feature-title">Super Fast Delivery</h4>
                  <p className="feature-text">
                    We ensure delivery within 30 minutes for your hunger.
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-box">
                  <ShieldCheck color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 className="feature-title">Fresh & Hygienic Food</h4>
                  <p className="feature-text">
                    We maintain strict hygiene protocols for every order.
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-box">
                  <CreditCard color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 className="feature-title">Secure Payments</h4>
                  <p className="feature-text">
                    Multiple payment options with industry standard security.
                  </p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-box">
                  <MapPin color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 className="feature-title">Real-Time Order Tracking</h4>
                  <p className="feature-text">
                    Track your food journey from kitchen to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="features-image-wrapper">
            <img
              src={FoodDeliveryPartner}
              alt="Food Delivery"
              className="features-image"
            />
          </div>
        </div>
      </section>

      {/* App Banner */}
      <section className="app-banner-section">
        <div className="app-banner">
          <div className="app-banner-content">
            <h2 className="app-banner-title">
              Order Faster with the QuickMato App
            </h2>
            <p className="app-banner-desc">
              Download our app for exclusive deals, faster delivery, and live
              tracking features.
            </p>
            <div className="store-buttons">
              <div className="store-btn">
                <Smartphone size={24} />
                <div className="store-btn-text">
                  <span className="small-text">Get it on</span>
                  <span className="large-text">Google Play</span>
                </div>
              </div>
              <div className="store-btn">
                <Smartphone size={24} />
                <div className="store-btn-text">
                  <span className="small-text">Download on the</span>
                  <span className="large-text">App Store</span>
                </div>
              </div>
            </div>
          </div>
          <div className="app-banner-image-container">
            <img
              src={QuickMatoApp}
              alt="Mobile App"
              className="app-banner-img"
            />
          </div>
        </div>
      </section>

      {/* Partner With Us */}
      <section className="section partner-section">
        <div className="section-header" style={{ textAlign: "center" }}>
          <h2 className="section-title">Partner With Us</h2>
          <p className="section-subtitle">
            Grow your business or earn money on your own schedule
          </p>
        </div>

        <div className="partner-grid">
          <div className="partner-card">
            <img
              src={ForRestaurants}
              alt="Restaurant Partner"
              className="partner-img"
            />
            <div className="partner-content">
              <span className="partner-tag">For Restaurants</span>
              <h3 className="partner-card-title">List Your Restaurant</h3>
              <p className="partner-card-desc">
                Reach new customers and grow your sales by listing your menu on
                QuickMato.
              </p>
              <button
                className="btn-primary btn-block"
                onClick={() => navigate("/partner/onboarding")}
              >
                Register your store
              </button>
            </div>
          </div>
          <div className="partner-card">
            <img
              src={ForRiders}
              alt="Delivery Partner"
              className="partner-img"
            />
            <div className="partner-content">
              <span className="partner-tag">For Riders</span>
              <h3 className="partner-card-title">Join as Delivery Partner</h3>
              <p className="partner-card-desc">
                Earn competitive pay with flexible hours. Be your own boss.
              </p>
              <button
                className="btn-primary btn-block"
                style={{ background: "black" }}
              >
                Join as Rider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>QuickMato</h2>
            <p className="footer-desc">
              Your favorite food delivered fresh and hot. We are committed to
              providing the best food delivery experience.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {/* Social Icons Placeholder */}
              <span>📷</span>
              <span>🐦</span>
              <span>📘</span>
            </div>
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Team</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Help & Support</a>
              </li>
              <li>
                <a href="#">Partner with us</a>
              </li>
              <li>
                <a href="#">Ride with us</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
              <li>
                <a href="#">Refund & Cancellation</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Offer Terms</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 QuickMato Technologies Pvt. Ltd.</span>
          <span>Made with ❤️ in India By Yash</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
