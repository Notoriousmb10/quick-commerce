import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const newSocket = io("/", {
        path: "/socket.io",
        transports: ["websocket"],
      });

      setSocket(newSocket);
      console.log("Socket Connected");

      return () => newSocket.disconnect();
    } else {
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
