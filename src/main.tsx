import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LoginResponseDto } from "./user";
import Login from './Login';
import APP from './App';
import './index.css';
import "./styles.css";

const Main = () => {
  const [userData, setUserData] = useState<LoginResponseDto | null>(null);

  const handleLoginSuccess = (userData: LoginResponseDto) => {
    setUserData(userData);
  };

  return (
    <div>
      {userData ? (
        // Renderiza el componente APP solo si el usuario está logueado
        <APP user={userData} />
      ) : (
        // Si no está logueado, renderiza el Login
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
