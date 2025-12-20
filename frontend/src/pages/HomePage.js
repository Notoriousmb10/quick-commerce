import React, { useState } from "react";
import { Search, MapPin, Star, Clock, ShoppingBag } from "lucide-react";

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <style>
        {`
          :root {
            --primary: #E23744;
            --primary-hover: #d32f2f;
            --text-main: #2d3748;
            --text-secondary: #718096;
            --bg-light: #f7fafc;
            --card-border: #e2e8f0;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          body { margin: 0; padding: 0; background-color: #fff; }
          .hover-scale:hover { transform: scale(1.02); transition: transform 0.2s; }
        `}
      </style>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "4rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              margin: "0 0 1rem 0",
              lineHeight: "1.2",
              color: "var(--text-main)",
            }}
          >
            Delicious food, <br />
            <span style={{ color: "var(--primary)" }}>delivered quickly.</span>
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
            }}
          >
            Discover the best food & drinks in your area. Order now and get 20%
            off your first meal.
          </p>

          {/* Search Bar - styled similar to your cards */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow-md)",
              maxWidth: "500px",
            }}
          >
            <MapPin
              size={20}
              color="var(--primary)"
              style={{ marginLeft: "1rem" }}
            />
            <input
              type="text"
              placeholder="Enter your delivery location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                padding: "1rem",
                outline: "none",
                fontSize: "1rem",
                color: "var(--text-main)",
              }}
            />
            <button
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                padding: "0.8rem 2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
            alt="Delicious Food"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              boxShadow: "var(--shadow-md)",
            }}
          />
        </div>
      </div>

      {/* --- Categories --- */}
      <div style={{ backgroundColor: "#fafafa", padding: "4rem 0" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              margin: "0 0 3rem 0",
              color: "var(--text-main)",
              fontWeight: "700",
            }}
          >
            Inspiration for your first order
          </h3>
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="hover-scale"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    marginBottom: "1rem",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    border: "5px solid white",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontWeight: "600",
                    color: "var(--text-main)",
                    fontSize: "1.2rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Restaurant List (Mimicking your Orders list style) --- */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem" }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            color: "var(--text-main)",
          }}
        >
          Popular restaurants near you
        </h2>

        {/* Grid Layout mimicking the list but in grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              className="hover-scale"
              style={{
                border: "1px solid var(--card-border)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: "white",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* Image Header */}
              <div style={{ position: "relative", height: "200px" }}>
                <img
                  src={rest.image}
                  alt={rest.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {rest.discount && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      left: "0",
                      backgroundColor: "#2563eb",
                      color: "white",
                      padding: "0.25rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                  >
                    {rest.discount}
                  </span>
                )}
              </div>

              {/* Card Body - styled like your 'Orders' card content */}
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.25rem",
                      color: "var(--text-main)",
                    }}
                  >
                    {rest.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#065f46", // Dark green from your snippet
                      color: "white",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {rest.rating}{" "}
                    <Star
                      size={12}
                      fill="white"
                      style={{ marginLeft: "4px" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>{rest.tags.join(", ")}</span>
                  <span>${(Math.random() * 5 + 10).toFixed(2)} for one</span>
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  <Clock size={16} />
                  <span>{rest.time}</span>
                  <span style={{ margin: "0 0.5rem" }}>•</span>
                  <span>Free delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <footer
        style={{
          color: "white",
          padding: "3rem 2rem",
          marginTop: "4rem",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{ margin: "0 0 1rem 0", color: "black" }}>Quickmato</h2>
          <p style={{ color: "black", fontSize: "0.9rem" }}>
            © 2024 Quickmato Technologies Pvt. Ltd
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
