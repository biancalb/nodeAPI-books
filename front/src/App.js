import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Home } from './pages/Home'
import { List as Livros } from './pages/Livros/List'
import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Add } from './components/Add/Add'
import { Login } from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/auth';
import { useAuth } from './hooks/useAuth';
import React, { useState, useEffect, createContext } from 'react'





const Private = ({ Item,  path}) => {
  const { logged } = useAuth();
  if(!logged){
    return <Navigate to={'/login'} state={{goTo: path}}></Navigate>
  }
  return <Item />;
}

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
        <ToastContainer></ToastContainer>
          <Header />
          <Sidebar />
          <Routes>
            <Route path='*' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='livros' element={<Private Item={Livros} path='livros'/>} />
            <Route path='livros/add/' element={<Private Item={Add} path='livros/add/'/>} />
            <Route path='livros/view/:id' element={<Private Item={Add} path='livros/view/:id'/>} />
            <Route path='livros/edit/:id' element={<Private Item={Add} path='livros/view/:id'/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
