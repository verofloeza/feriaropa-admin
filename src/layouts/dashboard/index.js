import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import { db } from "contants/Firebase";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

function Dashboard() {
  const [ cantProd, setCantProd ] = useState(0);
  const [ users, setUsers ] = useState(0);
  const [ orders, setOrders] = useState(0);
  const [ seller, setSeller ] = useState(0);

  useEffect(()=>{
    const totalProd = async () =>{
        const productsSnapshot = await getDocs(query(collection(db, "products"), where('active', '==', true)));
        setCantProd(productsSnapshot.size)

        let usuarios = [];
        const querySnapshot = await getDocs(collection(db, "users"), where('active', '==', true));
        querySnapshot.forEach((doc) => {
          let info = doc.data();
          if (!info.role) {
            usuarios.push(info)
          }
        })
        let cantCliente = 0;
        let cantVendedor = 0;
        usuarios.map((user) =>{
          if(user.token || user.alias){
            cantVendedor = parseInt(cantVendedor)+1;
          }else{
            cantCliente= parseInt(cantCliente)+1;
          }
        })

        setUsers(cantCliente);
        setSeller(cantVendedor);
        
        const ordersSanpshot = await getDocs(query(collection(db, "orders")))
        setOrders(ordersSanpshot.size)
    }
    totalProd()
  },[])


  const { ventas } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Productos"
                count={cantProd}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="person_add"
                title="Total de usuarios"
                count={users}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Vendedores"
                count={seller}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Ventas"
                count={orders}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Ventas por semana"
                  date="última semana"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Ventas por mes"
                  date="Por 9 meses"
                  chart={ventas}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

    </DashboardLayout>
  );
}

export default Dashboard;
