import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

const ItemForm: React.FC<{ refreshCatalog?: () => void, item?: any, addItemToState?: (item: any) => void, updateItemIntoState?: (id: number) => void, toggle?: () => void }> = (props) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('danger');
  const [validated, setValidated] = useState(false);
  const [items, setItems] = useState([]);
  window.CATALOG_ITEMS_API_URL = 'https://localhost:7148/api';

  const fetchItems = async () => {
    try {
      const response = await fetch('https://localhost:7148/api/Items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    console.log('Props:', props);
    if (props.item) {
      const { id, name, description, price } = props.item;
      setId(id);
      setName(name);
      setDescription(description);
      setPrice(price);
      fetchItems();
    }
  }, [props]);
  

  const onChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'description') setDescription(value);
    if (name === 'price') setPrice(value);
  };

  const submitNew = async (e: { preventDefault: () => void; currentTarget: any; stopPropagation: () => void; }) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      await createItem();
    }
    setValidated(true);
  };

  const submitEdit = async (e: { preventDefault: () => void; currentTarget: any; stopPropagation: () => void; }) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      await updateItem();
    }
    setValidated(true);
  };

  const createItem = async () => {
    try {
      const response = await fetch(`${window.CATALOG_ITEMS_API_URL}/Items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          description: description,
          price: parseFloat(price)
        })
      });
  
      // Log response status and headers
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
  
      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(`Could not add the item: ${errorData.title}`);
      }
  
      // Log raw response text
      const responseText = await response.text();
      console.log('Raw Response Text:', responseText);
  
      // Check if the response text is empty
      if (!responseText) {
        throw new Error('Response body is empty.');
      }
  
      // Parse the response text to JSON
      const item = JSON.parse(responseText);
  
      if (props.addItemToState) {
        props.addItemToState(item);
      } else {
        console.error('addItemToState is undefined.');
      }
      if (props.toggle) {
        props.toggle();
      }
    } catch (err) {
      showAlert((err as Error).message);
    }
  };  

  const updateItem = async () => {
    try {
      const response = await fetch(`${window.CATALOG_ITEMS_API_URL}/Items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          name: name,
          description: description,
          price: parseFloat(price)
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(`Could not update the item: ${errorData.title}`);
      }
  
      if (response.status === 204 || !response.text()) {
        if (props.toggle) {
          props.toggle();
        }
        if (props.refreshCatalog) {
          props.refreshCatalog();
        }
        return;
      }
  
      const item = await response.json();
  
      if (props.toggle) {
        props.toggle();
      }
      if (props.refreshCatalog) {
        props.refreshCatalog();
      }
    } catch (err) {
      showAlert((err as Error).message);
    }
  };

  const showAlert = (message: React.SetStateAction<string>) => {
    setAlertMessage(message);
    setAlertColor('danger');
    setAlertVisible(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={props.item ? submitEdit : submitNew}>
      <Form.Group>
        <Form.Label htmlFor="name">Name:</Form.Label>
        <Form.Control type="text" name="name" onChange={onChange} value={name} required />
        <Form.Control.Feedback type="invalid">The Name field is required</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="description">Description:</Form.Label>
        <Form.Control type="text" name="description" onChange={onChange} value={description} />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="price">Price:</Form.Label>
        <Form.Control type="number" name="price" onChange={onChange} value={price} required />
        <Form.Control.Feedback type="invalid">The Price field is required</Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">Save</Button>

      <Alert style={{ marginTop: "10px" }} variant={alertColor} show={alertVisible}>
        {alertMessage}
      </Alert>
    </Form>
  );
};

export default ItemForm;
