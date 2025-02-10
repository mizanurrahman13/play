import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Table, Button, Form } from 'react-bootstrap';

interface Item {
  catalogItemId: number;
  name: string;
  description: string;
  quantity: number;
}

const Inventory: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [renderItems, setRenderItems] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedSuccess, setLoadedSuccess] = useState<boolean>(false);
  window.INVENTORY_ITEMS_API_URL = 'https://localhost:7257/api/'

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const populateItems = useCallback(async () => {
    if (userId === '') {
      return;
    }

    setItems([]);
    setRenderItems(true);
    setLoading(true);
    setLoadedSuccess(false);

    try {
      const response = await fetch(`${window.INVENTORY_ITEMS_API_URL}Items?userId=${userId}`);
      const returnedItems = await response.json();

      if (Array.isArray(returnedItems)) {
        setItems(returnedItems);
        setLoading(false);
        setLoadedSuccess(true);
      } else {
        throw new Error('API response is not an array');
      }
    } catch (err) {
      console.log(err);
      setItems([]);
      setLoading(false);
      setLoadedSuccess(false);
    }
  }, [userId]);

  useEffect(() => {
    if (renderItems) {
      populateItems();
    }
  }, [renderItems, populateItems]);

  const renderInputs = () => (
    <Form className="form-inline">
      <Form.Label htmlFor="userId" className="sr-only">User Id:</Form.Label>
      <Form.Control
        className="mb-2 mr-sm-2"
        style={{ minWidth: "350px" }}
        type="text"
        name="userId"
        id="userId"
        placeholder="Enter a user id"
        onChange={onChange}
        value={userId}
      />
      <Button className="mb-2" variant="primary" onClick={() => setRenderItems(true)}>Get Inventory</Button>
    </Form>
  );

  const renderItemsTable = () => (
    !renderItems ? '' :
    loading ? <p><em>Loading...</em></p> :
    !loadedSuccess ? <p>Could not load items</p> :
    <Container style={{ paddingTop: "10px", paddingLeft: "0px" }}>
      <Row>
        <Col>
          <Table striped>
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {!items || items.length <= 0 ? (
                <tr>
                  <td colSpan={6} align="center"><b>No Items yet</b></td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.catalogItemId}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );

  return (
    <div>
      <h1 id="tabelLabel">Inventory</h1>
      {renderInputs()}
      {renderItemsTable()}
    </div>
  );
};

export default Inventory;
