import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../redux/slices/categorySlice";
import styles from "./AddCategoryForm.module.css";

const DEFAULT_ICON = "💰";
const DEFAULT_COLOR = "#cccccc";

const AddCategoryForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("income");
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!name) return;

    dispatch(addCategory({
      name,
      icon: icon || DEFAULT_ICON,
      type,
      color: color || DEFAULT_COLOR,
      userId,
    }));

    setName("");
    setIcon("");
    setType("income");
    setColor(DEFAULT_COLOR);
    if (onClose) onClose();
  };

  return (
    <div className={styles.formContainer}>
      <h2>Добавить категорию</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Название</label>
          <input
            type="text"
            value={name}
            placeholder="Введите название"
            onChange={e => setName(e.target.value)}
            className={styles.fieldInput}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Иконка</label>
          <input
            type="text"
            value={icon}
            onChange={e => setIcon(e.target.value)}
            placeholder="Иконка по умолчанию 💰"
            className={styles.fieldInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Тип</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className={styles.fieldInput}
          >
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Цвет</label>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className={styles.fieldColor}
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>Добавить</button>
          {onClose && (
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;
