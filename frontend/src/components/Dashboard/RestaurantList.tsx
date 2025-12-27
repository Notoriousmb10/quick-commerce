import React, { useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { SlidersHorizontal } from "lucide-react";

interface RestaurantListProps {
  products: any[];
  addToCart: (item: any) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  products,
  addToCart,
}) => {
  const filters = [
    "Relevant",
    "Delivery Time",
    "Rating 4.0+",
    "Pure Veg",
    "Offers",
    "Cost: Low to High",
  ];
  const [activeFilter, setActiveFilter] = useState("Relevant");

  return (
    <div className="restaurant-list-section">
      <h3 className="section-head">
        {products.length} Restaurants around you (Mocked as items)
      </h3>

      <div className="filters-bar">
        <button
          className="filter-btn secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="resto-grid">
        {products.map((product) => (
          <RestaurantCard
            key={product._id}
            data={product}
            onClick={() => addToCart(product)}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button
          className="filter-btn secondary"
          style={{ padding: "0.8rem 2rem" }}
        >
          Load more restaurants
        </button>
      </div>
    </div>
  );
};

export default RestaurantList;
