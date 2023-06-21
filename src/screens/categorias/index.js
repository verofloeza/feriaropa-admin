import { Icon, Modal } from "@mui/material";
import React, { useState } from 'react'
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";

import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataCategories from "./data/DataCategories";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import MDBox from 'components/MDBox'
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from 'components/MDTypography'
import { db } from "contants/Firebase";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Categorias = () => {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [ render, setRender ] = useState(true);
  const [ id, setId ] = useState(null);
  const [ category, setCategory ] = useState(null);
  
  const handleOpen = async (id, category) => {
    setId(id)
    setCategory(category);
    setOpen(true);
  };
  const handleClose = () => {
    setear()
    setOpen(false);
  };

  const handleOpenNew = async () => {
    setOpenNew(true);
  };
  const handleCloseNew = () => {
    setear()
    setOpenNew(false);
  };

  const updateCategory =async (id) =>{
    const userRef = doc(db, "categories", id);
      const user = {
        name: category
      };
      try {
        await updateDoc(userRef, user);
        setear()
        setRender(true)
        handleClose()
      } catch (e) {
        console.error("Error al editar el usuario a Firestore:", e);
      }
   
    
  }

  const addCategory = async () =>{

    const userRef = collection(db, "categories");
    const user = {
      name: category,
      active: true,
      createdAt: new Date()
    };
    try {
      await addDoc(userRef, user);
      setear()
      setRender(true)
      handleCloseNew()
      

    } catch (e) {
      console.error("Error al editar el usuario a Firestore:", e);
    }
  }


  const setear = () =>{
    setCategory(null)
  }

    const { columns, rows } = DataCategories(handleOpen, render, setRender);
    
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
                  Categorias
                </MDTypography>
                <MDButton variant="gradient" color="dark" style={{float: 'right', marginTop: -30}} onClick={()=> handleOpenNew()}>
                  <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                  &nbsp;agregar
                </MDButton>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MDBox sx={{ ...style }}>
          <h2 id="child-modal-title">Editar Categoría</h2>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Nombre" variant="standard" fullWidth value={category} onChange={(e)=> setCategory(e.target.value)}/>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" size="small" onClick={()=> updateCategory(id)}>
                  Guardar
                </MDButton>
                <MDButton variant="outlined" color="secondary" size="small" onClick={handleClose} style={{left:5}}>
                Cerrar
              </MDButton>
              </MDBox>
              
            </MDBox>
          </MDBox>
          
        </MDBox>
      </Modal>
      <Modal
        open={openNew}
        onClose={handleCloseNew}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MDBox sx={{ ...style }}>
          <h2 id="child-modal-title">Agregar Categoría</h2>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Nombre" variant="standard" fullWidth value={category} onChange={(e)=> setCategory(e.target.value)}/>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" size="small" onClick={()=> addCategory()}>
                  Guardar
                </MDButton>
                <MDButton variant="outlined" color="secondary" size="small" onClick={handleCloseNew} style={{left:5}}>
                Cerrar
              </MDButton>
              </MDBox>
              
            </MDBox>
          </MDBox>
          
        </MDBox>
      </Modal>
    </DashboardLayout>
  )
}

export default Categorias