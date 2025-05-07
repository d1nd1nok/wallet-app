import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddTransaction from "../components/AddTransaction";
import EditTransactionForm from "../components/EditTransactionForm";
import { fetchTransactions, deleteTransaction } from "../redux/slices/transactionSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { logout } from "../redux/slices/authSlice";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const transactions = useSelector((state) => state.transactions.list || []);
  const categories = useSelector((state) => state.categories.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);


  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  const totalBalance = transactions.reduce(
    (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
    0
  );

  const [editingTx, setEditingTx] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDelete = (id) => {
    if (window.confirm("Удалить транзакцию?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Вы уверены, что хотите выйти?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const getCategoryStyle = (categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);
    return { color: cat?.color || "#000" };
  };

  
  const filteredTransactions = [...transactions]
    .filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (startDate && new Date(tx.date) < new Date(startDate)) return false;
      if (endDate && new Date(tx.date) > new Date(endDate)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const pageTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.greeting}>
        <span>Привет, {user}!</span>
        <div>
        <Link to="/stats" className={styles.headerLink}>
            Статистика
          </Link>
          <Link to="/settings" className={styles.headerLink}>
            Категории
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
        </div>
        
      </div>

      <h3 className={styles.balance}>Баланс: {totalBalance.toFixed(2)} ₸</h3>

      {!showAddForm ? (
      <button
        onClick={() => setShowAddForm(true)}
        className={styles.addTransactionBtn}
      >
        Добавить транзакцию
      </button>
    ) : (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <AddTransaction onClose={() => setShowAddForm(false)} />
        </div>
      </div>
    )}
      <h3 className={styles.transactionsHeader}>Последние транзакции:</h3>
      <div className={styles.filterWrapper}>
        <label className={styles.filterLabel}>
          Тип:
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </label>

        <label className={styles.filterLabel}>
          От:
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.dateInput}
          />
        </label>

        <label className={styles.filterLabel}>
          До:
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.dateInput}
          />
        </label>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setFilterType("all");
            setStartDate("");
            setEndDate("");
            setCurrentPage(1);
          }}
        >
          Сбросить фильтр
        </button>
      </div>


      {pageTransactions.length === 0 ? (
  <p className={styles.noTransactions}>Нет транзакций</p>
) : (
  <ul className={styles.transactionList}>
    {pageTransactions.map((tx) => (
       <li key={tx.id} className={styles.transactionItem}>
       <span className={styles.transactionContent}>
         <span className={styles.transactionText}>
           [{tx.date}]{" "}
           <span className={styles.category} style={getCategoryStyle(tx.category)}>
             {tx.category}
           </span>
         </span>
         <span
           className={`${styles.amount} ${
             tx.type === "income" ? styles.income : styles.expense
           }`}
         >
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
          <MdEditSquare />
          </button>
          <button
            onClick={() => handleDelete(tx.id)}
            className={styles.deleteBtn}
            title="Удалить"
          >
           <IoMdTrash />
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
)}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)}>⬅ Назад</button>
          )}
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage(currentPage + 1)}>Дальше ➡</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
