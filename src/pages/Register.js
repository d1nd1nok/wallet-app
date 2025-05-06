// pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Проверяем, есть ли уже такой пользователь
      const { data: users } = await axios.get("http://localhost:3001/users");
      const exists = users.find((u) => u.email === email);

      if (exists) {
        alert("Пользователь уже зарегистрирован");
        return;
      }

      await axios.post("http://localhost:3001/users", { email, password });
      alert("Регистрация прошла успешно");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Ошибка при регистрации");
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register;
