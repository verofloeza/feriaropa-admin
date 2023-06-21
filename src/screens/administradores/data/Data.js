import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { Icon } from '@mui/material';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { db } from 'contants/Firebase';

export default function Data(handleOpen, render, setRender ){
    const [ users, setUsers ] = useState(null);

    useEffect(()=>{
      const usersList = async () =>{
        const list = [];
        const querySnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "admin")));
        querySnapshot.forEach((doc) => {
          let info = doc.data();
          list.push({
              id: doc.id,
              name: info.name,
              email: info.email,
              image: info.image,
              active: info.active
            });
          
        });
        setUsers(list)
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

    let rows = [];
    if (users) {
      rows = users.map((user) => ({
        name: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.name}
          </MDTypography>
        ),
        email: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.email}
          </MDTypography>
        ),
        status: (
          user.active === true
         ? <MDBox ml={-1}>
              <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" onClick={()=>updateStatus(user.email, false)} style={{cursor: 'pointer'}} />
            </MDBox>
          : <MDBox ml={-1}>
              <MDBadge badgeContent="inactivo" color="error" variant="gradient" size="sm" onClick={()=>updateStatus(user.email, true)} style={{cursor: 'pointer'}} />
            </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => handleOpen(user.email)}>
            <Icon>edit</Icon>&nbsp;Editar
          </MDTypography>
        ),
      }));
    }
    
      return {
        columns: [
          { Header: "Nombre", accessor: "name", align: "left" },
          { Header: "email", accessor: "email", align: "left" },
          { Header: "Estado", accessor: "status", align: "center" },
          { Header: "acción", accessor: "action", align: "center" },
        ],
        rows
      };
}

