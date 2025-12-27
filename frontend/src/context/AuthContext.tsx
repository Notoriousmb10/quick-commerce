import React, { createContext, useState, useEffect, ReactNode } from "react";
import API from "../api/axios";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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

  const login = async (email: string, password: string) => {
    const { data } = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", data.token);

    setUser({ ...data, token: data.token });

    return data;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
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
