import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data: users } = await axios.get("http://localhost:3001/users");

      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        setError("Неверный email или пароль");
        return;
      }

      const fakeToken = "mock-token-12345";

      dispatch(loginSuccess({ user: user.email, userId: user.id, token: fakeToken }));
      localStorage.setItem("user", user.email);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("token", fakeToken);

      navigate("/dashboard");
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Произошла ошибка при попытке входа");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
