import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

import { Icon } from "@mui/material";
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { db } from 'contants/Firebase';

export default function DataCategories(handleOpen, render, setRender){
    const [ users, setUsers ] = useState(null);

    useEffect(()=>{
      const usersList = async () =>{
        const list = [];
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach((doc) => {
          let info = doc.data();
          list.push({
              id: doc.id,
              name: info.name,
              active: info.active
            });
          
        });
        setUsers(list)
        setRender(false)
        }
      usersList()
    }, [render])

    const updateStatus = async (id, status) =>{
      const userRef = doc(db, "categories", id);
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
        nombre: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.name}
          </MDTypography>
        ),
        estado: (
          user.active === true
          ? <MDBox ml={-1}>
               <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, false)} style={{cursor: 'pointer'}} />
             </MDBox>
           : <MDBox ml={-1}>
               <MDBadge badgeContent="inactivo" color="error" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, true)} style={{cursor: 'pointer'}} />
             </MDBox>
           ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => handleOpen(user.id, user.name)}>
            <Icon>edit</Icon>&nbsp;Editar
          </MDTypography>
        ),
      }));
    }
    
      return {
        columns: [
          { Header: "Nombre", accessor: "nombre", align: "left" },
          { Header: "estado", accessor: "estado", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ],
        rows
      };
}