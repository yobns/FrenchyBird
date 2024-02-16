import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const closeNavOnLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" expanded={expanded}>
      <Container>
        <Navbar.Brand href="/Game"><span className="logo">Frenchy<span style={{ color: '#ffea88', fontStyle: 'italic' }}>Bird</span></span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/Game" className={({ isActive }) => isActive ? 'activeLink' : 'link'} onClick={closeNavOnLinkClick}>Play!</NavLink>
            <NavLink to="/Rank" className={({ isActive }) => isActive ? 'activeLink' : 'link'} onClick={closeNavOnLinkClick}>Rank</NavLink>
          </Nav>
          <Nav>
            <button className='accountBtn' onClick={() => { navigate('/Profile'); closeNavOnLinkClick(); }}>Profile</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
