import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light text-center text-lg-start sticky-footer">
      <Container className="mt-4">
            <div className="text-center p-3 bg-light">
        © {new Date().getFullYear()} PLay UI
      </div>
        </Container>
      
    </footer>
  );
};

export default Footer;
