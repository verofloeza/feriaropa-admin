import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "contants/Firebase";

const salesLastMonth = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const sales = [];

  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(currentYear, month, 1);
    const endOfMonth = new Date(currentYear, month + 1, 0);

    const ordersSnapshot = await getDocs(
      query(collection(db, "orders"), where("date", ">=", startOfMonth), where("date", "<=", endOfMonth))
    );

    sales.push(ordersSnapshot.size);
  }

  return sales;
};

const getPastYearMonths = (numMonths) => {
  const currentDate = new Date();
  const months = [];

  for (let i = 0; i < numMonths; i++) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = monthDate.toLocaleDateString('es-ES', { month: 'short' });
    months.unshift(monthName);
  }
  console.log(months)
  return months;
};

export default {
  ventas: {
    labels: getPastYearMonths(12),
    datasets: { label: "Mobile apps", data: salesLastMonth() },
  }
};
