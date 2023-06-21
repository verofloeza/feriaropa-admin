import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Layout from "./components/Layout";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { auth } from "contants/Firebase";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Basic() {
    const history = useNavigate();
    const [ email, setEmail ] = useState(null)
    const [ pass, setPass ] = useState(null)

    useEffect(()=>{
        const checkFirebaseAuth = () => {
          const unsubscribe = auth.onAuthStateChanged( async(user) => {
    
              if (user) {
                  history(`../../dashboard`);
              }
          });
          
          return () => unsubscribe();
          };
          
          checkFirebaseAuth();
      },[])

    const login = async () => {
        signInWithEmailAndPassword(auth, email, pass)
                      .then((userCredential) => {
                        // Autenticación exitosa
                        const user = userCredential.user;
                        console.log('Usuario autenticado:', user);
                        history(`/dashboard`);
                      })
                      .catch((error) => {
                        
                          // Error en la autenticación
                          console.error('Error en la autenticación:', error);
                      });
    }


  return (
    <Layout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" onChange={(e)=> setEmail(e.target.value)} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" onChange={(e)=> setPass(e.target.value)} fullWidth />
            </MDBox>
            
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={()=> login()}>
                Iniciar Sesión
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </Layout>
  );
}

export default Basic;
