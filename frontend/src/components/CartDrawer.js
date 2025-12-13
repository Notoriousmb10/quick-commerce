import React, { useContext } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import CartContext from "../context/CartContext";
import { useNavigate } from "react-router-dom";
const CartDrawer = () => {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useContext(CartContext);

  const DELIVERY_FEE = 5;
  const TAX_RATE = 0.05;
  const taxAmount = cartTotal * TAX_RATE;
  const grandTotal = cartTotal + taxAmount + DELIVERY_FEE;
  const navigate = useNavigate();

  if (!isCartOpen) return null;
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return toast.error("Cart is empty");

    const items = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    try {
      const { data } = await API.post("/orders", {
        items,
        deliveryLocation: { address: "123 Main St" },
      });

      clearCart();
      toggleCart();
      toast.success("Order Placed Successfully!");

      window.dispatchEvent(new CustomEvent("orderPlaced", { detail: data }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="cart-drawer-overlay" onClick={toggleCart}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cartItems.length} items)</h2>
          <button className="close-btn" onClick={toggleCart}>
            &times;
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  navigate("/customer");
                  toggleCart();
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-info">
                  <h4>{item.product.name}</h4>
                  <p>${item.product.price} / unit</p>
                </div>
                <div className="item-controls">
                  <button onClick={() => updateQuantity(item.product._id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product._id, 1)}>
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    &#128465; {/* Trash icon */}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="bill-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>${DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn-success checkout-btn"
              onClick={handlePlaceOrder}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
