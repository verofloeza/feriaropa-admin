import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "contants/Firebase";

const daysWeek = () => {
  const diasSemanaTexto = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const Actual = new Date();
  const OneDay = new Date(Actual.getFullYear(), Actual.getMonth(), Actual.getDate() - 1);
  const TwoDay = new Date(OneDay.getFullYear(), OneDay.getMonth(), OneDay.getDate() - 1);
  const ThreeDay = new Date(TwoDay.getFullYear(), TwoDay.getMonth(), TwoDay.getDate() - 1);
  const FourDay = new Date(ThreeDay.getFullYear(), ThreeDay.getMonth(), ThreeDay.getDate() - 1);
  const FiveDay = new Date(FourDay.getFullYear(), FourDay.getMonth(), FourDay.getDate() - 1);
  const SixDay = new Date(FiveDay.getFullYear(), FiveDay.getMonth(), FiveDay.getDate() - 1);
  const SevenDay = new Date(SixDay.getFullYear(), SixDay.getMonth(), SixDay.getDate() - 1);

  const dayWeekNumOne = OneDay.getDay();
  const dayWeekOne = diasSemanaTexto[dayWeekNumOne];

  const dayWeekNumTwo = TwoDay.getDay();
  const dayWeekTwo = diasSemanaTexto[dayWeekNumTwo];

  const dayWeekNumThree = ThreeDay.getDay();
  const dayWeekThree = diasSemanaTexto[dayWeekNumThree];
  
  const dayWeekNumFour = FourDay.getDay();
  const dayWeekFour = diasSemanaTexto[dayWeekNumFour];
  
  const dayWeekNumFive = FiveDay.getDay();
  const dayWeekFive = diasSemanaTexto[dayWeekNumFive];

  const dayWeekNumSix = SixDay.getDay();
  const dayWeekSix = diasSemanaTexto[dayWeekNumSix];
  
  const dayWeekNumSeven = SevenDay.getDay();
  const dayWeekSeven = diasSemanaTexto[dayWeekNumSeven];

  return [`${dayWeekSeven}`, `${dayWeekSix}`, `${dayWeekFive}`, `${dayWeekFour}`, `${dayWeekThree}`, `${dayWeekTwo}`, `${dayWeekOne}`];
};

const sales = async () => {
  const fechaActual = new Date();
  const fechaAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - 1);

  const startOfDay = new Date(fechaAnterior.getFullYear(), fechaAnterior.getMonth(), fechaAnterior.getDate());
  const endOfDay = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

  const ordersSnapshot = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDay), where("date", "<", endOfDay))
  );

  const fechaTwoDias = new Date(fechaAnterior.getFullYear(), fechaAnterior.getMonth(), fechaAnterior.getDate() - 1);
  const startOfDayTwo = new Date(fechaTwoDias.getFullYear(), fechaTwoDias.getMonth(), fechaTwoDias.getDate());
  const endOfDayTwo = new Date(fechaAnterior.getFullYear(), fechaAnterior.getMonth(), fechaAnterior.getDate());

  const ordersSnapshotTwo = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDayTwo), where("date", "<", endOfDayTwo))
  );

  const fechaThreeDias = new Date(fechaTwoDias.getFullYear(), fechaTwoDias.getMonth(), fechaTwoDias.getDate() - 1);
  const startOfDayThree = new Date(fechaThreeDias.getFullYear(), fechaThreeDias.getMonth(), fechaThreeDias.getDate());
  const endOfDayThree = new Date(fechaTwoDias.getFullYear(), fechaTwoDias.getMonth(), fechaTwoDias.getDate());

  const ordersSnapshothree = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDayThree), where("date", "<", endOfDayThree))
  );

  const fechaFourDias = new Date(fechaThreeDias.getFullYear(), fechaThreeDias.getMonth(), fechaThreeDias.getDate() - 1);
  const startOfDayFour = new Date(fechaFourDias.getFullYear(), fechaFourDias.getMonth(), fechaFourDias.getDate());
  const endOfDayFour = new Date(fechaFourDias.getFullYear(), fechaFourDias.getMonth(), fechaFourDias.getDate());

  const ordersSnapshoFour = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDayFour), where("date", "<", endOfDayFour))
  );

  const fechaFiveDias = new Date(fechaFourDias.getFullYear(), fechaFourDias.getMonth(), fechaFourDias.getDate() - 1);
  const startOfDayFive = new Date(fechaFiveDias.getFullYear(), fechaFiveDias.getMonth(), fechaFiveDias.getDate());
  const endOfDayFive = new Date(fechaFiveDias.getFullYear(), fechaFiveDias.getMonth(), fechaFiveDias.getDate());

  const ordersSnapshoFive = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDayFive), where("date", "<", endOfDayFive))
  );

  const fechaSixDias = new Date(fechaFiveDias.getFullYear(), fechaFiveDias.getMonth(), fechaFiveDias.getDate() - 1);
  const startOfDaySix = new Date(fechaSixDias.getFullYear(), fechaSixDias.getMonth(), fechaSixDias.getDate());
  const endOfDaySix = new Date(fechaSixDias.getFullYear(), fechaSixDias.getMonth(), fechaSixDias.getDate());

  const ordersSnapshoSix = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDaySix), where("date", "<", endOfDaySix))
  );

  const fechaSevenDias = new Date(fechaSixDias.getFullYear(), fechaSixDias.getMonth(), fechaSixDias.getDate() - 1);
  const startOfDaySeven = new Date(fechaSevenDias.getFullYear(), fechaSevenDias.getMonth(), fechaSevenDias.getDate());
  const endOfDaySeven = new Date(fechaSevenDias.getFullYear(), fechaSevenDias.getMonth(), fechaSevenDias.getDate());

  const ordersSnapshoSeven = await getDocs(
    query(collection(db, "orders"), where("date", ">=", startOfDaySeven), where("date", "<", endOfDaySeven))
  );

  return [ordersSnapshoSeven.size, ordersSnapshoSix.size, ordersSnapshoFive.size, ordersSnapshoFour.size, ordersSnapshothree.size, ordersSnapshotTwo.size, ordersSnapshot.size];
};

export default {
  labels: daysWeek(),
  datasets: [{ label: "Ventas", data: await sales() }],
};