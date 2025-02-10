import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css'; // Ensure to import your CSS file
import { ApplicationPaths } from '../Constants';

const NavMenu: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg" className="sticky-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">PLAY UI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to={ApplicationPaths.CatalogPath}>Catalog</Nav.Link>
            <Nav.Link as={Link} to={ApplicationPaths.InventoryPath}>Inventory</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;