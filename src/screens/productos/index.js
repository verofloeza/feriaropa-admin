import React, { useEffect, useState } from 'react'

import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataProducts from "./data/DataProducts";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { auth } from 'contants/Firebase';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
    const history = useNavigate()
    const [ render, setRender ] = useState(true);
    const { columns, rows } = DataProducts(render, setRender);

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
                  Productos
                </MDTypography>
              </MDBox>
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

export default Productos
