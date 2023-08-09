import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

import Card from "@mui/material/Card";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Grid from "@mui/material/Grid";
import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { auth } from 'contants/Firebase';
import { db } from 'contants/Firebase';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
    const history = useNavigate()
    const [ render, setRender ] = useState(true);
    const [ rows, setRows ] = useState(null);

    useEffect(()=>{
      const usersList = async () =>{
        const usersList = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
        }));

        const productsSnapshot = await getDocs(collection(db, "products"));
        const products = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          image: doc.data().image,
          active: doc.data().active,
          title: doc.data().name,
          price: doc.data().price1,
        }));

        products.forEach((product) => {
          const user = users.find((user) => user.email === product.email);
          if (user) {
            usersList.push({
              id: product.id,
              email: product.email,
              image: product.image,
              active: product.active,
              title: product.title,
              name: user.name,
              price: product.price,
            });
          }
        });

        setRows(usersList);
        setRender(false)
        }
      usersList()
    }, [render])
  
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
    
    const updateStatus = async (id, status) =>{
      const userRef = doc(db, "products", id);
      const product = {
        active: status
      };
      try {
        await updateDoc(userRef, product);
        setRender(true)
      } catch (e) {
        console.error("Error al editar el usuario a Firestore:", e);
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
                  Productos
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                      {
                        rows ?
                        <div>
                          <TableContainer component={Paper}>
                            <Table>
                              
                              <TableBody>
                                <TableRow>
                                  <TableCell>Imagen</TableCell>
                                  <TableCell>Nombre</TableCell>
                                  <TableCell>Diseñador</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Precio</TableCell>
                                  <TableCell>Estado</TableCell>
                                </TableRow>
                                {
                                 
                                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                  <TableRow key={row.id}>
                                    <TableCell><MDBox display="flex" alignItems="center" lineHeight={1}>
                                        <MDAvatar src={row.image} name={row.name} size="sm" /> 
                                      </MDBox></TableCell>
                                    <TableCell><MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                      {row.title}
                                    </MDTypography></TableCell>
                                    <TableCell>
                                    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                        {row.name}
                                      </MDTypography>
                                      </TableCell>
                                    <TableCell>
                                    <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                        {row.email}
                                      </MDTypography>
                                      </TableCell>
                                      <TableCell>
                                      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                                        $ {row.price}
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

export default Productos
