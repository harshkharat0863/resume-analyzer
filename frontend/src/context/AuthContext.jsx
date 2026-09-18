import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("resumecheck_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe(token)
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("resumecheck_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem("resumecheck_token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem("resumecheck_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}