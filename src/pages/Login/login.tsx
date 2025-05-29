import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./login.css";

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Usuário registrado com sucesso!");
      setEmail("");
      setPassword("");
      setIsRegistering(false);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login bem-sucedido!");
      navigate("/agendamento");
    } catch (error: any) {
      setMessage("Email ou senha incorretos ou usuário não registrado.");
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={isRegistering ? handleRegister : handleLogin}
      >
        <h2 className="login-title">
          {isRegistering ? "Registrar" : "Login"}
        </h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {isRegistering ? "Registrar" : "Entrar"}
        </button>

        <p className="message">{message}</p>

        <p className="switch">
          {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
          <span
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage("");
            }}
          >
            {isRegistering ? "Faça login" : "Registre-se"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
