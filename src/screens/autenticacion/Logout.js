import React, { useEffect } from 'react'

import { auth } from 'contants/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const history = useNavigate()

    useEffect(()=>{
       signOut(auth)
        .then(() => {
        history(`./authentication/sign-in`);
        })
        .catch((error) => {
        console.error("Error al hacer logout:", error);
        }); 
    }, [])
    
  return (
    <div>
      <p>Aguarde un momento!</p>
    </div>
  )
}

export default Logout
