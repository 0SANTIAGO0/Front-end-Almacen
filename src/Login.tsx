import { useState } from "react";
import { LoginResponseDto } from "./user";
import "./Login.css";
import "./styles.css";

const Login = ({ onLoginSuccess }: { onLoginSuccess: (userData: LoginResponseDto) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", { email, password });

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: email,
          contrasenia: password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Llamar a la función onLoginSuccess para pasar los datos a la vista de APP
        onLoginSuccess(userData);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.mensaje || "Error desconocido");
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Intenta nuevamente.");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Sistema de Gestión Almacen</h1>
          <p>Accede con tus credenciales empresariales</p>
        </div>
        <form onSubmit={handleLogin}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="usuario@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Ingresar</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="login-footer">
          <small>© {new Date().getFullYear()} TuEmpresa S.A. Todos los derechos reservados.</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
