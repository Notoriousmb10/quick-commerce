import React from "react";
import { Star, Clock } from "lucide-react";

interface RestaurantCardProps {
  data: any;
  onClick: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ data, onClick }) => {
  // Determine random/mock data if real data is missing properties
  const rating = data.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
  const time = "25-30 min";
  const discount =
    data.discount || (Math.random() > 0.5 ? "50% OFF up to $5" : null);

  return (
    <div className="resto-card" onClick={onClick}>
      <div className="resto-img-container">
        <img
          src={
            data.image ||
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
          }
          alt={data.name}
          className="resto-img"
        />
        {data.isPromoted && <span className="promoted-badge">Promoted</span>}
        {discount && <div className="offer-badge-overlay">{discount}</div>}
        <div className="time-badge">{time}</div>
      </div>

      <div className="resto-info" style={{ padding: "1rem" }}>
        <div className="resto-name-row">
          <div className="resto-name">{data.name}</div>
          <div className="rating-badge">
            {rating} <Star size={10} fill="white" />
          </div>
        </div>

        <div className="resto-desc">
          {data.category} • {data.cuisine || "Fast Food"}
        </div>

        <div className="resto-meta">
          <span>${data.price} for one</span>
          {/* <span>2.5 km away</span> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
