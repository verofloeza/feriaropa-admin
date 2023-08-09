import { Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Grid from "@mui/material/Grid";
import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
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

const Usuarios = () => {
    const history = useNavigate(); 
    const [ render, setRender ] = useState(true);
    const [ busqueda, setBusqueda ] = useState(null);
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState(0);
    const [ rows, setRows ] = useState(null);
  
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
    
    const handleChange = (event) => {
      setFiltro(event.target.value);
      console.log(filtro)
    };
  
    // const { columns, rows } = DataUser(render, setRender, busqueda, tabValue);

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
                {/* <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> */}

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
                                        <Icon>edit</Icon>&nbsp;Editar
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
    </DashboardLayout>
  )
}

export default Usuarios
