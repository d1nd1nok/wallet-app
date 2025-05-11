import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
  editCategory,
} from "../redux/slices/categorySlice";
import { fetchTransactions } from "../redux/slices/transactionSlice";
import { MdEditSquare } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import styles from "../module.css/CategorySettings.module.css";
import AddCategoryForm from "../components/AddCategoryForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";


const DEFAULT_ICON = "💰";
const DEFAULT_COLOR = "#cccccc";

const CategorySettings = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const transactions = useSelector((state) => state.transactions.list);
  const navigate = useNavigate();
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    icon: "",
    color: DEFAULT_COLOR,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleEditClick = (cat) => {
    setEditingCategoryId(cat.id);
    setEditValues({ name: cat.name, icon: cat.icon, color: cat.color });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editValues.name) return;

    dispatch(
      editCategory({
        id: editingCategoryId,
        updatedData: {
          ...editValues,
          icon: editValues.icon || DEFAULT_ICON,
        },
      })
    );

    setEditingCategoryId(null);
    setEditValues({ name: "", icon: "", color: DEFAULT_COLOR });
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить категорию?")) {
      dispatch(deleteCategory(id));
      if (editingCategoryId === id) {
        setEditingCategoryId(null);
        setEditValues({ name: "", icon: "", color: DEFAULT_COLOR });
      }
    }
  };

   const handleLogout = () => {
      if (window.confirm("Вы уверены, что хотите выйти?")) {
        dispatch(logout());
        navigate("/login");
      }
    };

  const getTotalForCategory = (categoryName) => {
    if (!transactions || !Array.isArray(transactions)) return 0;
    return transactions
      .filter((tx) => tx.category === categoryName)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const renderCategoryItem = (cat, type) => (
    <li
      key={cat.id}
      className={styles.categoryItem}
      style={{ color: cat.color || "#000" }}
    >
      {editingCategoryId === cat.id ? (
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <h4>Редактировать:</h4>
          <input
            type="text"
            value={editValues.name}
            onChange={(e) =>
              setEditValues({ ...editValues, name: e.target.value })
            }
            className={styles.input}
            required
          />
          <input
            type="text"
            value={editValues.icon}
            onChange={(e) =>
              setEditValues({ ...editValues, icon: e.target.value })
            }
            className={styles.input}
          />
          <input
            type="color"
            value={editValues.color}
            onChange={(e) =>
              setEditValues({ ...editValues, color: e.target.value })
            }
            className={styles.inputColor}
          />
          <button type="submit" className={styles.saveBtn}>Сохранить</button>
          <button
            type="button"
            onClick={() => setEditingCategoryId(null)}
            className={styles.cancelBtn}
          >
            Отмена
          </button>
        </form>
      ) : (
        <div className={styles.itemContent}>
          <div className={styles.leftSide}>
            <span className={styles.categoryInfo}>
              {cat.icon || DEFAULT_ICON} {cat.name}
            </span>
            <span className={styles.total}>
              {type === "income" ? (
                <span style={{ color: "green" }}>
                  {getTotalForCategory(cat.name)} ₸
                </span>
              ) : (
                <span style={{ color: "red" }}>
                  {getTotalForCategory(cat.name)} ₸
                </span>
              )}
            </span>
          </div>
          <div className={styles.rightSide}>
            <button
              onClick={() => handleEditClick(cat)}
              className={styles.actionBtn}
            >
              <MdEditSquare />
            </button>
            <button
              onClick={() => handleDelete(cat.id)}
              className={styles.actionBtn}
            >
              <IoMdTrash />
            </button>
          </div>
        </div>
      )}
    </li>
  );

  const totalIncome = incomeCategories.reduce(
    (sum, cat) => sum + getTotalForCategory(cat.name),
    0
  );
  
  const totalExpense = expenseCategories.reduce(
    (sum, cat) => sum + getTotalForCategory(cat.name),
    0
  );

  return (
    <div className={styles.CategoryConteiner}>
      <div className={styles.greeting}>
        <h4>Категории</h4>
        <div>
          <Link to="/stats" className={styles.headerLink}>
              Статистика
            </Link>
            <Link to="/dashboard" className={styles.headerLink}>
              Транзакции
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
          </div>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className={styles.addCategoryBtn}
        >
          Добавить категорию
        </button>
      ) : (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <AddCategoryForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      <div className={styles.rowContainer}>
        <div className={styles.container}>
            <h3 className={styles.totalrow}>Доходы:
            <span style={{ color: "green", fontWeight: "normal" }}>
              +{totalIncome} ₸
            </span>
            </h3>
          <ul className={styles.categoryList}>
            {incomeCategories.map((cat) => renderCategoryItem(cat, "income"))}
          </ul>
        </div>

        <div className={styles.container}>
            <h3 className={styles.totalrow}>
              Расходы:
              <span style={{ color: "red", fontWeight: "normal" }}>
                -{totalExpense} ₸
              </span>
            </h3>
          <ul className={styles.categoryList}>
            {expenseCategories.map((cat) => renderCategoryItem(cat, "expense"))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategorySettings;
