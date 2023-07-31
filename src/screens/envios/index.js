import React, { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from 'contants/Firebase';

import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Data from "./data/Data";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography'
import Modal from "@mui/material/Modal";
import { useNavigate } from 'react-router-dom';

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

const Envios = () => {
    const history = useNavigate();
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);
    const [ render, setRender ] = useState(true);
    const [ id, setId ] = useState(null);
    const [ campo, setCampo ] = useState(null);
    const [ precio, setPrecio ] = useState(null);

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
    
    const handleOpen = async (id) => {
      setId(id);

      const documentoRef = doc(db, 'shipping', id);
      const documentoSnapshot = await getDoc(documentoRef);
      const datos = documentoSnapshot.data();
      setCampo(datos.field)
      setPrecio(datos.price)

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

    const updateUser =async (id) =>{
      const userRef = doc(db, "shipping", id);
        const user = {
          field: campo,
          price: precio
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

    const addUser = async () =>{

      const userRef = collection(db, "shipping");
      const user = {
        field: campo,
        price: precio,
        active: true,
        createdAt: new Date()
      };
      try {
        await addDoc(userRef, user);

      } catch (e) {
        console.error("Error al editar el usuario a Firestore:", e);
      }
    }


    const setear = () =>{
      setId(null)
      setCampo(null)
      setPrecio(null)
    }



    const { columns, rows } = Data(handleOpen, render, setRender);

    
   
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
                  Tabla de envio
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
          <h2 id="child-modal-title">Editar Envio</h2>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Campo" variant="standard" fullWidth value={campo} onChange={(e)=> setCampo(e.target.value)}/>
              </MDBox>
              <MDBox mb={2}>
                <MDInput type="email" label="Precio" variant="standard" fullWidth value={precio} onChange={(e)=> setPrecio(e.target.value)} />
              </MDBox>
              
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" size="small" onClick={()=> updateUser(id)}>
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
          <h2 id="child-modal-title">Agregar Envio</h2>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="text" label="Campo" variant="standard" fullWidth value={campo} onChange={(e)=> setCampo(e.target.value)}/>
              </MDBox>
              <MDBox mb={2}>
                <MDInput type="email" label="Precio" variant="standard" fullWidth value={precio} onChange={(e)=> setPrecio(e.target.value)} />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" size="small" onClick={()=> addUser()}>
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

export default Envios
