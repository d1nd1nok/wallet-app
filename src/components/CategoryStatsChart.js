import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import React, { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = () => {
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель",
    "Май", "Июнь", "Июль", "Август",
    "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const transactions = useSelector((state) => state.transactions.list);
  const categoriesFromStore = useSelector((state) => state.categories.items); // Извлекаем категории из Redux

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  if (!transactions || transactions.length === 0) {
    return <p>Нет данных для отображения статистики.</p>;
  }

  // Получение доступных годов и месяцев
  const years = Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear())));
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1...12]

  // Фильтрация по дате
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const yearMatch = selectedYear === "all" || date.getFullYear() === Number(selectedYear);
    const monthMatch = selectedMonth === "all" || date.getMonth() + 1 === Number(selectedMonth);
    return yearMatch && monthMatch;
  });

  // Функция для вычисления статистики (доходы или расходы)
  const getCategoryTotals = (type) => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === type) {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      }
      return acc;
    }, {});
  };

  const incomeCategoryTotals = getCategoryTotals("income");
  const expenseCategoryTotals = getCategoryTotals("expense");

  const getCategoryColor = (categoryName) => {
    const category = categoriesFromStore?.find(c => c.name === categoryName);
    return category?.color || "#ccc";  // дефолтный цвет серый
  };

  const createChartData = (categoryTotals) => {
    const categories = Object.keys(categoryTotals);
    const totals = Object.values(categoryTotals);

    return {
      labels: categories,
      datasets: [
        {
          data: totals,
          backgroundColor: categories.map(cat => getCategoryColor(cat)), // Используем цвет из категории
          borderWidth: 1,
        },
      ],
    };
  };

  const incomeData = createChartData(incomeCategoryTotals);
  const expenseData = createChartData(expenseCategoryTotals);

  const options = {
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Статистика по доходам и расходам</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          <option value="all">Все годы</option>
          {years.map((year, idx) => (
            <option key={idx} value={year}>{year}</option>
          ))}
        </select>

        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
          <option value="all">Все месяцы</option>
          {monthNames.map((name, index) => (
            <option key={index} value={index + 1}>{name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ width: "48%" }}>
          <h3>Доходы</h3>
          {Object.keys(incomeCategoryTotals).length === 0 ? (
            <p>Нет данных за выбранный период для доходов.</p>
          ) : (
            <Doughnut data={incomeData} options={options} />
          )}
        </div>

        <div style={{ width: "48%" }}>
          <h3>Расходы</h3>
          {Object.keys(expenseCategoryTotals).length === 0 ? (
            <p>Нет данных за выбранный период для расходов.</p>
          ) : (
            <Doughnut data={expenseData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
