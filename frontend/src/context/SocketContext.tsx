import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const context = useContext(AuthContext);

  useEffect(() => {
    if (context?.user) {
      const newSocket = io("/", {
        path: "/socket.io",
        transports: ["websocket"],
      });

      setSocket(newSocket);
      console.log("Socket Connected");

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [context?.user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
