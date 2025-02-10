// Layout.tsx
import React from 'react';
import NavMenu from './navmenu/NavMenu';
import Footer from './footer/Footer';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div>
      <NavMenu />
      <div className="container mt-3">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;


