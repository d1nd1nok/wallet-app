import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addTransaction } from "../redux/slices/transactionSlice";

const AddTransaction = () => {
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
    <form onSubmit={handleSubmit}>
      <h4>Добавить транзакцию</h4>

      <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>
      <br />

      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <br />

      <select
        name="category"
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
      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <br />

      <button type="submit">Добавить транзакцию</button>
    </form>
  );
};

export default AddTransaction;
