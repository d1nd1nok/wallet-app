import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  editCategory,
} from "../redux/slices/categorySlice";

const DEFAULT_ICON = "📁";
const DEFAULT_COLOR = "#cccccc";

const CategorySettings = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [type, setType] = useState("income");
  const [color, setColor] = useState(DEFAULT_COLOR);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    icon: "",
    color: DEFAULT_COLOR,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const categoryData = {
      name,
      icon: icon || DEFAULT_ICON,
      type,
      color: color || DEFAULT_COLOR,
      userId,
    };

    dispatch(addCategory(categoryData));
    setName("");
    setIcon("");
    setType("income");
    setColor(DEFAULT_COLOR);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

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

  const handleEditClick = (cat) => {
    setEditingCategoryId(cat.id);
    setEditValues({ name: cat.name, icon: cat.icon, color: cat.color });
  };

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  return (
    <div>
      <h2>Категории</h2>

      {/* Форма добавления — ВСЕГДА видна */}
      <div>
        <h3>Добавить категорию</h3>
        <form onSubmit={handleAddSubmit}>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="📁"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Цвет"
          />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <h3>Доходы:</h3>
      <ul>
        {incomeCategories.map((cat) => (
          <li key={cat.id} style={{ color: cat.color || "#000" }}>
            {editingCategoryId === cat.id ? (
              <form onSubmit={handleEditSubmit} style={{ display: "inline" }}>
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) =>
                    setEditValues({ ...editValues, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  value={editValues.icon}
                  onChange={(e) =>
                    setEditValues({ ...editValues, icon: e.target.value })
                  }
                />
                <input
                  type="color"
                  value={editValues.color}
                  onChange={(e) =>
                    setEditValues({ ...editValues, color: e.target.value })
                  }
                />
                <button type="submit">💾</button>
                <button
                  type="button"
                  onClick={() => setEditingCategoryId(null)}
                >
                  ❌
                </button>
              </form>
            ) : (
              <>
                {cat.icon || DEFAULT_ICON} {cat.name}
                <button onClick={() => handleEditClick(cat)}>🖊️</button>
                <button onClick={() => handleDelete(cat.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Расходы:</h3>
      <ul>
        {expenseCategories.map((cat) => (
          <li key={cat.id} style={{ color: cat.color || "#000" }}>
            {editingCategoryId === cat.id ? (
              <form onSubmit={handleEditSubmit} style={{ display: "inline" }}>
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) =>
                    setEditValues({ ...editValues, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  value={editValues.icon}
                  onChange={(e) =>
                    setEditValues({ ...editValues, icon: e.target.value })
                  }
                />
                <input
                  type="color"
                  value={editValues.color}
                  onChange={(e) =>
                    setEditValues({ ...editValues, color: e.target.value })
                  }
                />
                <button type="submit">💾</button>
                <button
                  type="button"
                  onClick={() => setEditingCategoryId(null)}
                >
                  ❌
                </button>
              </form>
            ) : (
              <>
                {cat.icon || DEFAULT_ICON} {cat.name}
                <button onClick={() => handleEditClick(cat)}>🖊️</button>
                <button onClick={() => handleDelete(cat.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySettings;
