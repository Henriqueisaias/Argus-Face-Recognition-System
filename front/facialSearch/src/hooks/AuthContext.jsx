import { createContext, useState } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const loginToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logoutToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loginToken, logoutToken }}>
      {children}
    </AuthContext.Provider>
  );
};
