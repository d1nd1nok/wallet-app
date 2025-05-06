import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import MonthlyStatsChart from "../components/MonthlyStatsChart";
import { fetchTransactions } from "../redux/slices/transactionSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import CategoryStatsChart from "../components/CategoryStatsChart";
const Stats = () => {
  const transactions = useSelector((state) => state.transactions.list || []);
    const categories = useSelector((state) => state.categories.items || []);
   const dispatch = useDispatch();
    useEffect(() => {
       dispatch(fetchTransactions());
       dispatch(fetchCategories());
     }, [dispatch]);
  console.log("transactions:", transactions);
  return (
    <div>
      <MonthlyStatsChart transactions={transactions} />
      <CategoryStatsChart />
    </div>
  );
};

export default Stats;
