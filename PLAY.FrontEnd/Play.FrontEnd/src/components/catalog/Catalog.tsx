import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import ItemModal from '../ItemModal';
import GrantItemModal from '../GrantItemModal';

interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
  }

const Catalog: React.FC = () => {
  //const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedSuccess, setLoadedSuccess] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  window.CATALOG_ITEMS_API_URL = 'https://localhost:7148/api/'

  const populateItems = useCallback(async () => {
    try {
      const response = await fetch(`${window.CATALOG_ITEMS_API_URL}Items`);
      const returnedItems = await response.json();
      setItems(returnedItems);
      setLoading(false);
      setLoadedSuccess(true);
    } catch (err) {
      console.log(err);
      setItems([]);
      setLoading(false);
      setLoadedSuccess(false);
    }
  }, []);

  useEffect(() => {
    populateItems();
  }, [populateItems]);

  const addItemToState = (item: Item) => {
  setItems((prevItems) => [...prevItems, item]);
};

  const updateState = () => {
    populateItems();
  };

  const deleteItemFromState = (id: number) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const deleteItem = async (id: any) => {
    const confirmDeletion = window.confirm('Do you really wish to delete it?');
    if (confirmDeletion) {
      try {
        await fetch(`${window.CATALOG_ITEMS_API_URL}Items/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        deleteItemFromState(id);
      } catch (err) {
        console.log(err);
        window.alert("Could not delete the item.");
      }
    }
  };

  const renderItemsTable = (items: any[]) => (
    <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length <= 0 ? (
                <tr>
                  <td colSpan={6} align="center"><b>No Items yet</b></td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    <td align="center">
                      <div>
                        <ItemModal
                          isNew={false}
                          item={item}
                          updateItemIntoState={updateState}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <GrantItemModal item={item} />
                        &nbsp;&nbsp;&nbsp;
                        <Button variant="danger" onClick={() => deleteItem(item.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <ItemModal isNew={true} addItemToState={addItemToState} />
        </Col>
      </Row>
    </Container>
  );

  return (
    <div>
      <h1 id="tabelLabel">Catalog Items</h1>
      {loading ? <p><em>Loading...</em></p> : loadedSuccess ? renderItemsTable(items) : <p>Could not load items</p>}
    </div>
  );
};

export default Catalog;
