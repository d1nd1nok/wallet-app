import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import MonthlyStatsChart from "../components/MonthlyStatsChart";
import { fetchTransactions } from "../redux/slices/transactionSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import CategoryStatsChart from "../components/CategoryStatsChart";
import styles from "./CategorySettings.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
const Stats = () => {
  const transactions = useSelector((state) => state.transactions.list || []);
    const categories = useSelector((state) => state.categories.items || []);
    const navigate = useNavigate();
   const dispatch = useDispatch();
    useEffect(() => {
       dispatch(fetchTransactions());
       dispatch(fetchCategories());
     }, [dispatch]);
  console.log("transactions:", transactions);

  const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти?")) {
          dispatch(logout());
          navigate("/login");
        }
      };

  return (
    <div className={styles.CategoryConteiner}>
      <div className={styles.greeting}>
        <h4>Статистика</h4>
        <div>
          <Link to="/settings" className={styles.headerLink}>
              Категории
            </Link>
            <Link to="/dashboard" className={styles.headerLink}>
              Транзакции
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
          </div>
      </div>
      <MonthlyStatsChart transactions={transactions} />
      <CategoryStatsChart />
    </div>
  );
};

export default Stats;
