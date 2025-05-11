import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "../module.css/Login.module.css";


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
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Вход в аккаунт</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button}>
            Войти
          </button>
        </form>
        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <span onClick={() => navigate('/register')} className={styles.link}>
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
