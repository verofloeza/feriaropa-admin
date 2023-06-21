import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import PropTypes from 'prop-types';
import { db } from 'contants/Firebase';

const Author = ({ image }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar src={image} name={name} size="sm" /> 
  </MDBox>
);

Author.propTypes = {
  image: PropTypes.string.isRequired,
};

export default function DataProducts(render, setRender){
    const [ users, setUsers ] = useState(null);

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

        setUsers(usersList);
        setRender(false)
        }
      usersList()
    }, [render])
  
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

    let rows = [];
    if (users) {
      rows = users.map((user) => ({
        img: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={user.image} name={user.name} size="sm" /> 
          </MDBox>
        ),
        nombre: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.title}
          </MDTypography>
        ),
        diseñador: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.name}
          </MDTypography>
        ),
        email: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.email}
          </MDTypography>
        ),
        precio: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            $ {user.price}
          </MDTypography>
        ),
        estado: (
         user.active === true
         ? <MDBox ml={-1}>
              <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, false)} style={{cursor: 'pointer'}} />
            </MDBox>
          : <MDBox ml={-1}>
              <MDBadge badgeContent="innactivo" color="danger" variant="gradient" size="sm" onClick={()=>updateStatus(user.id, true)} style={{cursor: 'pointer'}} />
            </MDBox>
        ),
      }));
    }
    
      return {
        columns: [
          { Header: "Imagen", accessor: "img", align: "left" },
          { Header: "Nombre", accessor: "nombre", align: "left" },
          { Header: "Diseñador", accessor: "diseñador", align: "left" },
          { Header: "Email", accessor: "email", align: "left" },
          { Header: "Precio", accessor: "precio", align: "center" },
          { Header: "Estado", accessor: "estado", align: "center" },
        ],
        rows
      };
}