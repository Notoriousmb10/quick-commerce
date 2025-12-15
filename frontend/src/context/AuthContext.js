import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/auth/me")
      .then((res) => {
        setUser({ ...res.data, token });
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);

    setUser({ ...data, token: data.token });

    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    localStorage.setItem("token", data.token);
    setUser({ ...data, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
