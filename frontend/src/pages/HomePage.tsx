import React, { useState } from "react";
import { Search, MapPin, Star, Clock, ShoppingBag } from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const phrases = [
    { text: "Hungry?", highlight: "We got you." },
    { text: "Cravings called.", highlight: "We answered." },
    { text: "Hunger calls,", highlight: "we deliver." },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const restaurants = [
    {
      _id: "r1",
      name: "Burger King",
      rating: 4.5,
      time: "25-30 min",
      tags: ["American", "Burgers"],
      image:
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
      discount: "50% OFF",
    },
    {
      _id: "r2",
      name: "Sushi Master",
      rating: 4.8,
      time: "40-45 min",
      tags: ["Japanese", "Sushi"],
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
      discount: "Free Delivery",
    },
    {
      _id: "r3",
      name: "Pizza Hut",
      rating: 4.2,
      time: "30-35 min",
      tags: ["Italian", "Pizza"],
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80",
      discount: null,
    },
    {
      _id: "r4",
      name: "La Pasta",
      rating: 4.3,
      time: "35-40 min",
      tags: ["Italian", "Pasta"],
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
      discount: "20% OFF",
    },
    {
      _id: "r5",
      name: "Taco Bell",
      rating: 4.1,
      time: "20-25 min",
      tags: ["Mexican", "Tacos"],
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
      discount: null,
    },
    {
      _id: "r6",
      name: "Healthy Bowl",
      rating: 4.7,
      time: "15-20 min",
      tags: ["Healthy", "Salads"],
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
      discount: "10% OFF",
    },
  ];

  const categories = [
    {
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
    },
    {
      name: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
    },
    {
      name: "Sushi",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80",
    },
    {
      name: "Vegan",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80",
    },
    {
      name: "Dessert",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80",
    },
    {
      name: "Ice Cream",
      image:
        "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&q=80",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title" key={currentPhraseIndex}>
          {phrases[currentPhraseIndex].text}{" "}
          <span style={{ color: "var(--primary)" }}>
            {phrases[currentPhraseIndex].highlight}
          </span>
        </h1>
        <p className="hero-subtitle">
          Order from the best restaurants and get it delivered in minutes.
        </p>

        <div className="search-container">
          <MapPin
            size={20}
            color="var(--primary)"
            style={{ marginLeft: "1rem" }}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Enter your delivery location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">Find Food</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">What's on your mind?</h2>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.name} className="category-card">
              <div className="category-img-container">
                <img src={cat.image} alt={cat.name} className="category-img" />
              </div>
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Top Restaurants in Your City</h2>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((rest) => (
            <div key={rest._id} className="restaurant-card">
              <div className="card-image-container">
                <img src={rest.image} alt={rest.name} className="card-image" />
                {rest.discount && (
                  <div className="discount-badge">{rest.discount}</div>
                )}
              </div>

              <div className="card-content">
                <div className="restaurant-name-row">
                  <h3 className="restaurant-name">{rest.name}</h3>
                  <div className="rating-badge">
                    {rest.rating} <Star size={10} fill="white" />
                  </div>
                </div>

                <div className="meta-row">
                  <span>{rest.tags.join(", ")}</span>
                  <span>$20 for two</span>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <Clock size={16} /> {rest.time}
                  </div>
                  <div className="info-item">
                    <ShoppingBag size={16} /> Free Delivery
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "3rem",
          background: "#fff",
          borderTop: "1px solid #eee",
          marginTop: "2rem",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", color: "#333", fontSize: "1.5rem" }}>
          Quickmato
        </h3>
        <p style={{ color: "#888" }}>
          © 2024 Quickmato Technologies. Made with ❤️ for food by{" "}
          <a href="https://github.com/notoriousmb10">Yash</a> .
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
