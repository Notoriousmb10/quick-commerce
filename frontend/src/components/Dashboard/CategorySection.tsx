import React from "react";

const CategorySection = () => {
  const categories = [
    {
      name: "Pizza",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
    },
    {
      name: "Burger",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80",
    },
    {
      name: "Biryani",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&q=80",
    },
    {
      name: "Chinese",
      img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&q=80",
    },
    {
      name: "Desserts",
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80",
    },
    {
      name: "South Indian",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80",
    },
    {
      name: "Healthy",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80",
    }, // Reusing image for now
  ];

  return (
    <div className="categories-section">
      <h3 className="section-head">Eat what makes you happy</h3>
      <div className="cat-rail">
        {categories.map((cat, idx) => (
          <div key={idx} className="cat-item">
            <div className="cat-img-wrapper">
              <img src={cat.img} alt={cat.name} className="cat-img" />
            </div>
            <span className="cat-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
