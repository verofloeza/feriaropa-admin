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
        const querySnapshot = await getDocs(collection(db, "shipping"));
        querySnapshot.forEach((doc) => {
          let info = doc.data();
          list.push({
              id: doc.id,
              campo: info.field,
              precio: info.price,
              active: info.active
            });
          
        });
        setUsers(list)
        setRender(false)
        }
      usersList()
    }, [render])

    const updateStatus = async (id, status) =>{
      const userRef = doc(db, "shipping", id);
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
    console.log(users)
    let rows = [];
    if (users) {
      
      rows = users.map((user) => ({
        campo: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.campo}
          </MDTypography>
        ),
        precio: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.precio}
          </MDTypography>
        ),
        status: (
          user.active === true
         ? <MDBox ml={-1}>
              <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, false)} style={{cursor: 'pointer'}} />
            </MDBox>
          : <MDBox ml={-1}>
              <MDBadge badgeContent="inactivo" color="error" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, true)} style={{cursor: 'pointer'}} />
            </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => handleOpen(user.id)}>
            <Icon>edit</Icon>&nbsp;Editar
          </MDTypography>
        ),
      }));
    }
    
      return {
        columns: [
          { Header: "Campo", accessor: "campo", align: "left" },
          { Header: "Precio", accessor: "precio", align: "left" },
          { Header: "Estado", accessor: "status", align: "center" },
          { Header: "acción", accessor: "action", align: "center" },
        ],
        rows
      };
}

