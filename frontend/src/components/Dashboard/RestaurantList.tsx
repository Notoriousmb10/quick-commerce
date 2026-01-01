import React, { useState, useEffect, useRef } from "react";
import RestaurantCard from "./RestaurantCard";
import { SlidersHorizontal } from "lucide-react";

interface RestaurantListProps {
  products: any[];
  addToCart: (item: any) => void;
  onCategoryChange?: (category: string) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  products,
  addToCart,
  onCategoryChange,
}) => {
  const [groupedProducts, setGroupedProducts] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    const grouped = products.reduce((acc, product) => {
      const cat = product.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {} as { [key: string]: any[] });
    setGroupedProducts(grouped);
  }, [products]);

  // Scroll Spy Logic
  useEffect(() => {
    if (!onCategoryChange) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          onCategoryChange(visibleSection.target.id.replace("cat-", ""));
        }
      },
      {
        rootMargin: "-100px 0px -50% 0px", // Trigger when section is near top
        threshold: 0,
      }
    );

    const sections = document.querySelectorAll(".category-section-group");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [groupedProducts, onCategoryChange]);

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
      <h3 className="section-head">{products.length} Restaurants around you</h3>

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

      <div className="resto-list-container">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div
            key={category}
            id={`cat-${category}`}
            className="category-section-group"
            style={{ marginBottom: "3rem", scrollMarginTop: "120px" }}
          >
            <h4 className="category-section-title">{category}</h4>
            <div className="resto-grid">
              {items.map((product) => (
                <RestaurantCard
                  key={product._id}
                  data={product}
                  onClick={() => addToCart(product)}
                />
              ))}
            </div>
          </div>
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
