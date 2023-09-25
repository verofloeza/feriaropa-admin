import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "contants/Firebase";

const salesLastMonth = async () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const sales = [];

  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(currentYear, month, 1);
    const endOfMonth = new Date(currentYear, month + 1, 0);

    const formattedStartOfMonth = startOfMonth.toString(); // Convierte a formato de cadena
    const formattedEndOfMonth = endOfMonth.toString(); // Convierte a formato de cadena

    try {
      const ordersSnapshot = await getDocs(
        query(
          collection(db, "orders"),
          where("date", ">=", formattedStartOfMonth),
          where("date", "<=", formattedEndOfMonth)
        )
      );
      sales.push(ordersSnapshot.size);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  
  }
  console.log(sales)
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
  
  return months;
};

export default {
  ventas: {
    labels: getPastYearMonths(12),
    datasets: { label: "Ventas Mensuales", data: await salesLastMonth() },
  }
};
