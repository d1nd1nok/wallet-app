import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addTransaction } from "../redux/slices/transactionSlice";
import styles from "./AddTransaction.module.css";

const AddTransaction = ({ onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    const userId = localStorage.getItem("userId");

    const transaction = {
      type,
      amount: parseFloat(amount),
      category,
      date,
      userId,
    };

    dispatch(addTransaction(transaction));
    setAmount("");
    setCategory("");
    setDate("");
  };

  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <div className={styles.formContainer}>
      <h2>Добавить транзакцию</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Тип</label>
          <select
            className={styles.fieldSelect}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Сумма</label>
          <input
            type="number"
            className={styles.fieldInput}
            placeholder="Введите сумму"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Категория</label>
          <select
            className={styles.fieldSelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Выберите категорию</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Дата</label>
          <input
            type="date"
            className={styles.fieldInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>
            Добавить
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;