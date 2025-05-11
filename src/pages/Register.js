import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../module.css/Register.module.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Создать аккаунт</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Зарегистрироваться
          </button>
        </form>
        <p className={styles.footerText}>
          Уже есть аккаунт? <span onClick={() => navigate("/login")} className={styles.link}>Войти</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
