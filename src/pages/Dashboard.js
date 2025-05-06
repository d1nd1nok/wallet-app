import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // 👈 импорт
import AddTransaction from "../components/AddTransaction";
import EditTransactionForm from "../components/EditTransactionForm";
import { fetchTransactions, deleteTransaction } from "../redux/slices/transactionSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { logout } from "../redux/slices/authSlice";

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
    <div>
      <h2>
        Привет, {user}!{" "}
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Выйти
        </button>
      </h2>
      <h3>Баланс: {totalBalance.toFixed(2)} ₸</h3>

      <AddTransaction />

      <label>
        Показать:
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Все</option>
          <option value="income">Только доходы</option>
          <option value="expense">Только расходы</option>
        </select>
      </label>

      <h3>Последние транзакции:</h3>
      <ul>
  {filteredTransactions.map((tx) => (
    <li key={tx.id}>
      [{tx.date}]{" "}
      <span style={getCategoryStyle(tx.category)}>{tx.category}</span>:{" "}
      {tx.type === "income" ? "+" : "-"}
      {tx.amount} ₸
      <button onClick={() => setEditingTx(tx)}>✏️</button>
      <button onClick={() => handleDelete(tx.id)}>🗑</button>

      {/* 👇 если редактируется этот tx — показываем форму */}
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
