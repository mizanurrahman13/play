import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Layout from './components/Layout';
import { ApplicationPaths } from './components/Constants';
import Catalog from './components/catalog/Catalog';
import Inventory from './components/inventory/Inventory';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ApplicationPaths.CatalogPath} element={<Catalog />}  />
        <Route path={ApplicationPaths.InventoryPath} element={<Inventory />}  />
      </Routes>
    </Layout>
  );
}

export default App;

