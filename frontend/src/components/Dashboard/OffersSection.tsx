import React from "react";

const OffersSection = () => {
  return (
    <div className="offers-section">
      <div className="offer-banner">
        <div className="offer-content">
          <span className="offer-tag">Use Code: WELCOME50</span>
          <h2 className="offer-title">
            50% OFF
            <br />
            on First Order
          </h2>
          <p className="offer-sub">Max discount: $100</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80"
          alt="Pizza Offer"
          className="offer-image"
        />
      </div>

      {/* 
         In a real app, there might be a second banner here or a slider.
         The design showed two main banners next to each other or a wide one.
         For now, one large banner looks great, or we could split the section.
      */}
    </div>
  );
};

export default OffersSection;
