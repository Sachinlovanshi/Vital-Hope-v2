import { createContext, useState, useEffect } from "react";
import socket from "../socket/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      socket.connect();
      socket.emit("registerSocket", {
        userId: JSON.parse(userData)._id
      });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    socket.connect();
    socket.emit("registerSocket", { userId: data.user._id });
  };

  const logout = () => {
    localStorage.clear();
    socket.disconnect();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
