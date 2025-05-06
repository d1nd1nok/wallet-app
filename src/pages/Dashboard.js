import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // 👈 импорт
import AddTransaction from "../components/AddTransaction";
import EditTransactionForm from "../components/EditTransactionForm";
import { fetchTransactions, deleteTransaction } from "../redux/slices/transactionSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { logout } from "../redux/slices/authSlice";
import styles from "./Dashboard.module.css";


function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const transactions = useSelector((state) => state.transactions.list || []);
  const categories = useSelector((state) => state.categories.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 навигация

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const totalBalance = transactions.reduce((acc, tx) =>
    tx.type === "income" ? acc + tx.amount : acc - tx.amount, 0
  );

  const [editingTx, setEditingTx] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const handleDelete = (id) => {
    if (window.confirm("Удалить транзакцию?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Вы уверены, что хотите выйти?")) {
      dispatch(logout());
      navigate("/login"); // 👈 редирект после выхода
    }
  };

  const getCategoryStyle = (categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);
    return { color: cat?.color || "#000" };
  };

  const filteredTransactions = [...transactions]
    .filter((tx) => filterType === "all" || tx.type === filterType)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.greeting}>
          <span>Привет, {user}!</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
        </div>
    
        <h3 className={styles.balance}>Баланс: {totalBalance.toFixed(2)} ₸</h3>
    
        <AddTransaction />
    
        <div className={styles.filterWrapper}>
          <label className={styles.filterLabel}>
            Показать:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Все</option>
              <option value="income">Только доходы</option>
              <option value="expense">Только расходы</option>
            </select>
          </label>
        </div>
    
        <h3 className={styles.transactionsHeader}>Последние транзакции:</h3>
        <ul className={styles.transactionList}>
          {filteredTransactions.map((tx) => (
            <li key={tx.id} className={styles.transactionItem}>
              <span className={styles.transactionText}>
                [{tx.date}]{" "}
                <span className={styles.category} style={getCategoryStyle(tx.category)}>
                  {tx.category}
                </span>:{" "}
                <span className={styles.amount}>
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount} ₸
                </span>
              </span>
    
              <div className={styles.transactionActions}>
                <button
                  onClick={() => setEditingTx(tx)}
                  className={styles.editBtn}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className={styles.deleteBtn}
                  title="Удалить"
                >
                  🗑
                </button>
              </div>
    
              {editingTx?.id === tx.id && (
                <EditTransactionForm
                  transaction={editingTx}
                  onClose={() => setEditingTx(null)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }    

export default Dashboard;
