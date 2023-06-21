import React, { useEffect, useState } from 'react'

import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataTable from "examples/Tables/DataTable";
import DataUser from "./data/DataUser";
import Grid from "@mui/material/Grid";
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { auth } from 'contants/Firebase';
import breakpoints from 'assets/theme/base/breakpoints';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
    const history = useNavigate(); 
    const [ render, setRender ] = useState(true);
    const [ busqueda, setBusqueda ] = useState(null);
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
      // A function that sets the orientation state of the tabs.
      function handleTabsOrientation() {
        return window.innerWidth < breakpoints.values.sm
          ? setTabsOrientation("vertical")
          : setTabsOrientation("horizontal");
      }
  
      /** 
       The event listener that's calling the handleTabsOrientation function when resizing the window.
      */
      window.addEventListener("resize", handleTabsOrientation);
  
      // Call the handleTabsOrientation function to set the state with the initial value.
      handleTabsOrientation();
  
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleTabsOrientation);
    }, [tabsOrientation]);

    useEffect(()=>{
      const checkFirebaseAuth = () => {
        const unsubscribe = auth.onAuthStateChanged( async(user) => {
  
            if (!user) {
                history(`./authentication/sign-in`);
            }
        });
        
        return () => unsubscribe();
        };
        
        checkFirebaseAuth();
    },[])
  
    const handleSetTabValue = (event, newValue) => {
      setTabValue(newValue);
      setRender(true)
    }

    const search = (buscar) =>{
      setBusqueda(buscar)
      setRender(true)
    }
    
    const handleChange = (event) => {
      setFiltro(event.target.value);
      console.log(filtro)
    };
  
    const { columns, rows } = DataUser(render, setRender, busqueda, tabValue);
    
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Usuarios
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} py={3} px={2} alignItems="center">
                <Grid item>
                <MDInput label="Buscar por nombre" onBlur={(e)=>search(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                <AppBar position="static">
                  <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                    <Tab label="Todos" />
                    <Tab label="Clientes" />
                    <Tab label="Vendedores" />
                  </Tabs>
                </AppBar>
              </Grid>
              </Grid>
              
              
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>  
    </DashboardLayout>
  )
}

export default Usuarios
