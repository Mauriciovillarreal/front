import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';
import LoginWidget from "../LoginWidget/LoginWidget";
import "./NavBar.css";
import { CartWidget } from '../CartWidget/CartWidget';

export const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login'; 
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  return (
    <header>
      <div>
        <h1><Link to="/">L'ESSENZA</Link></h1>
      </div>
      <div className='loginWidget'>
        {user ? (
          <>
            <button className="toggle-button" onClick={toggleOffcanvas}>
              <img src="../img/user.png" alt="" />
            </button>
            <CartWidget />
            <div className={`offcanvas-nav ${isOffcanvasOpen ? 'open' : ''}`}>
              <button className="close-button" style={{ width: '10px' }} onClick={closeOffcanvas}>
                <img src="../img/cerrar-cruz.png" alt="" />
              </button>
              <div className='userInfo'>
              <h5>{user.first_name} {user.last_name}</h5>
              <h6>Email: {user.email}</h6>
              <h6>Role: {user.role}</h6>
              </div>
              <button className='btnLogOut' onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </>
        ) : (
          <LoginWidget />
        )}
      </div>
    </header>
  );
};

export default NavBar;
