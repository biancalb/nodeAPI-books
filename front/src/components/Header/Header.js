import React, { useState, useEffect } from 'react'
import './Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logged, authSignOut } = useAuth();
  
  function handleClick(path) {
    navigate(path);
  }

  const signOut = () => {
    if(window.confirm(`Deseja realmente sair?`)){
      toast.success('Deslogado!');
      authSignOut();
      navigate('/');
    }
  }

  return (
    <div >
      <Navbar expand="xl" className='header'>
        <Container>
          <Navbar.Brand onClick={() => handleClick('/')} className='title'>Sistema de livros</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {logged && <><b>Usuário: {user ?? ''}</b> <i onClick={() => signOut()}><FaSignOutAlt/></i></>}
              {!logged && <b onClick={() => handleClick('/login')} >Login</b>}
            </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}
