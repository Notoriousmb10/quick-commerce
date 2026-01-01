import React from "react";

interface CategorySidebarProps {
  categories: { name: string; img?: string }[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="category-sidebar">
      <h3 className="sidebar-title">Categories</h3>
      <div className="sidebar-list">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`sidebar-item ${
              activeCategory === cat.name ? "active" : ""
            }`}
            onClick={() => onSelectCategory(cat.name)}
          >
            <div className="sidebar-img-wrapper">
              {cat.img && (
                <img src={cat.img} alt={cat.name} className="sidebar-img" />
              )}
            </div>
            <span className="sidebar-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
