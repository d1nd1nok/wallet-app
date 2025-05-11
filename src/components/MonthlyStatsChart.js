import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../module.css/MonthlyStatsChart.module.css";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyStatsChart = ({ transactions }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  // Проверка на загрузку данных
  if (!transactions || transactions.length === 0) {
    return <p style={{ textAlign: "center", fontSize: "18px" }}>Нет данных для отображения статистики.</p>;
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  const getTotalsByMonth = (type) => {
    const totals = new Array(12).fill(0);
    transactions
      .filter(
        (tx) =>
          tx.type === type &&
          new Date(tx.date).getFullYear() === Number(year)
      )
      .forEach((tx) => {
        const month = new Date(tx.date).getMonth(); // 0 - январь
        totals[month] += Number(tx.amount);
      });
    return totals;
  };

  const incomeData = getTotalsByMonth("income");
  const expenseData = getTotalsByMonth("expense");

  const data = {
    labels: [
      "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
      "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
    ],
    datasets: [
      {
        label: "Доходы",
        data: incomeData,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Расходы",
        data: expenseData,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "₸";
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Месячная статистика доходов и расходов</h2>

      <div className={styles.controls}>
        <label htmlFor="year" className={styles.label}>Год: </label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={styles.select}
        >
          {getYearOptions().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyStatsChart;
