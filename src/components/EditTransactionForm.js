import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTransaction } from "../redux/slices/transactionSlice";
import styles from "../module.css/EditTransactionForm.module.css";

const EditTransactionForm = ({ transaction, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items || []);
  const [formData, setFormData] = useState({ ...transaction });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTransaction(formData));
    onClose();
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type
  );

  return (
    <div className={styles.container}>
      <h4 className={styles.header}>Редактировать транзакцию</h4>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={styles.input}
          required
        >
          <option value="">Выберите категорию</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>
            Сохранить
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransactionForm;
