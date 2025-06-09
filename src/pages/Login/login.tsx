import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import "./login.css";

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // campo novo
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Por favor, insira um nome.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Atualiza o displayName do usuário
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      setMessage("Usuário registrado com sucesso!");
      setEmail("");
      setPassword("");
      setName("");
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

        {isRegistering && (
          <>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label htmlFor="email" className="email">E-mail</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="password">Senha</label>
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
            style={{ color: "#f5d105", cursor: "pointer", fontWeight: 700}}
          >
            {isRegistering ? "Faça login" : "Registre-se"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
