import { Icon, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Grid from "@mui/material/Grid";
import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import PropTypes from 'prop-types';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { auth } from 'contants/Firebase';
import breakpoints from 'assets/theme/base/breakpoints';
import { db } from 'contants/Firebase';
import { useNavigate } from 'react-router-dom';

const Author = ({ image, name }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar src={image} name={name} size="sm" />
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  </MDBox>
);

Author.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

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

const Usuarios = () => {
    const history = useNavigate(); 
    const [ render, setRender ] = useState(true);
    const [ busqueda, setBusqueda ] = useState(null);
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState(0);
    const [ rows, setRows ] = useState(null);
    const [ open, setOpen ] = useState(false);
    const [ datos, setDatos ] = useState(null);
  
    useEffect(()=>{
      const usersList = async () =>{
        const list = [];
        let querySnapshot = '';

        if (busqueda) {
          const lowercaseBusqueda = busqueda.toLowerCase();
          querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            let info = doc.data();
            if (!info.role && info.fullName && info.fullName.toLowerCase().includes(lowercaseBusqueda)) {
              const fecha = new Date(info.createdAt);
              const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha
                .getFullYear()
                .toString()
                .substring(2)}`;
              list.push({
                email: info.email,
                image: info.image,
                active: info.active,
                name: info.fullName,
                token: info.token,
                alias: info.alias,
                date: formattedDate
              });
            }
          });

        } else {
          // No hay búsqueda, obtén todos los documentos
          querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            let info = doc.data();
            if (!info.role) {
              if(tabValue === 0){
                const fecha = new Date(info.createdAt);
                const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha
                  .getFullYear()
                  .toString()
                  .substring(2)}`;
                list.push({
                  email: info.email,
                  image: info.image,
                  active: info.active,
                  name: info.fullName,
                  token: info.token,
                  alias: info.alias,
                  date: formattedDate
                });
              } else if(tabValue === 1){
                if( !info.token && !info.alias){
                  const fecha = new Date(info.createdAt);
                  const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha
                    .getFullYear()
                    .toString()
                    .substring(2)}`;
                  list.push({
                    email: info.email,
                    image: info.image,
                    active: info.active,
                    name: info.fullName,
                    token: info.token,
                    alias: info.alias,
                    date: formattedDate
                  });
                }
                
              }  else if(tabValue === 2){
                if( info.token || info.alias){
                  const fecha = new Date(info.createdAt);
                  const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha
                    .getFullYear()
                    .toString()
                    .substring(2)}`;
                  list.push({
                    email: info.email,
                    image: info.image,
                    active: info.active,
                    name: info.fullName,
                    token: info.token,
                    alias: info.alias,
                    date: formattedDate
                  });
                }
                
              }
              
            }
          });
        }
        
        setRows(list)
        setRender(false)
        }
      usersList()
    }, [render])
    
    const updateStatus = async (email, status) =>{
      const userRef = doc(db, "users", email);
      const user = {
        active: status
      };
      try {
        await updateDoc(userRef, user);
        setRender(true)
      } catch (e) {
        console.error("Error al editar el usuario a Firestore:", e);
      }
    }

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


    // Opciones de paginación
    const rowsPerPageOptions = [10, 20, 30];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  
    // Función para cambiar de página
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    // Función para cambiar el número de filas por página
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleOpen = async (id) => {
      obtenerDatos(id)
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const obtenerDatos = async (email) => {
       const docRef = doc(db, "users", email);
       try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data())
          setDatos(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    }
    
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
                {
                        rows ?
                        <div>
                          <TableContainer component={Paper}>
                            <Table>
                              
                              <TableBody>
                                <TableRow>
                                  <TableCell>Nombre</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Fecha</TableCell>
                                  <TableCell>Estado</TableCell>
                                  <TableCell>Accion</TableCell>
                                </TableRow>
                                {
                                 
                                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                  <TableRow key={row.id}>
                                    <TableCell>
                                    <Author image={row.image} name={row.name} />
                                      </TableCell>
                                    <TableCell>
                                    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                        {row.email}
                                      </MDTypography>
                                      </TableCell>
                                      <TableCell>
                                      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                        {row.date}
                                      </MDTypography>
                                      </TableCell>
                                      <TableCell>
                                     { row.active === true
                                                ? <MDBox ml={-1}>
                                                      <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" onClick={()=>updateStatus(row.id, false)} style={{cursor: 'pointer'}} />
                                                    </MDBox>
                                                  : <MDBox ml={-1}>
                                                      <MDBadge badgeContent="innactivo" color="danger" variant="gradient" size="sm" onClick={()=>updateStatus(row.id, true)} style={{cursor: 'pointer'}} />
                                                    </MDBox>
                                                    }
                                      </TableCell>
                                      <TableCell>
                                      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => handleOpen(row.email)}>
                                        <Icon sx={{ fontSize: 30 }}>remove_red_eye</Icon>&nbsp;Ver
                                      </MDTypography>
                                      </TableCell>
                                  </TableRow>
                                ))
                                
                              }
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </div>
                        : <MDBox ml={-1}></MDBox>
                      
                      }
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
          <h2 id="child-modal-title">Ver Usuario</h2>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Nombre y Apellido: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.fullName}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Usuario:
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.nickname}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Dirección: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                 {datos.address}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Documento: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.documento}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Email: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.email}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Teléfono: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.telefono}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Teléfono Adicional: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.telefonoD}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography component="a" href="#" variant="caption" color="dark" fontWeight="bold">
                  Medios de Pago de Preferencia: 
                </MDTypography>
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{marginLeft: 10}}>
                  {datos.favoritePayment}
                </MDTypography>
              </MDBox>
              
              <MDBox mt={4} mb={1}>
                <MDButton variant="outlined" color="secondary" size="small" onClick={handleClose} style={{left:5}}>
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

export default Usuarios
