import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import PropTypes from 'prop-types';
import { db } from 'contants/Firebase';

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

export default function DataUser(render, setRender, busqueda, tabValue){
    const [ users, setUsers ] = useState(null);
    

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
        author: (
          <Author image={user.image} name={user.name} />
        ),
        email: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.email}
          </MDTypography>
        ),
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.date}
          </MDTypography>
        ),
        type: (
          user.token || user.alias
         ? <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              Vendedor
            </MDTypography>
          : <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              Cliente
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
      }));
    }
    
      return {
        columns: [
          { Header: "Nombre", accessor: "author", width: "30%", align: "left" },
          { Header: "Email", accessor: "email", align: "left" },
          { Header: "Fecha", accessor: "date", align: "left" },
          { Header: "Tipo", accessor: "type", align: "center" },
          { Header: "Estado", accessor: "status", align: "center" },
        ],
        rows
      };
}