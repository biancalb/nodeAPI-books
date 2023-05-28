import React from 'react'
import { useNavigate } from "react-router-dom";
import './Sidebar.css';

export const Sidebar = () => {
  const navigate = useNavigate();

  function handleClick(path) {
    navigate(path);
  }

  return (
    <div className='sidebar'>
        <nav>
            <ul>
                <li onClick={() => handleClick('/')}>Home</li>
                <li onClick={() => handleClick('/livros')}>Livros</li>
            </ul>
        </nav>  
    </div>
  )
}
