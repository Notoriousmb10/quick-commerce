import React, { createContext, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:5000");
      console.log("Socket Connected");

      if (user.role === "partner") {
      }
    } else {
      if (socket.current) {
        socket.current.disconnect();
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
