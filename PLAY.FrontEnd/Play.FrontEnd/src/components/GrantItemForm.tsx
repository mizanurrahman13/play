import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const GrantItemForm: React.FC<{ item?: any, toggle?: () => void }> = (props) => {
  const [id, setId] = useState('');
  const [userId] = useState(uuidv4());
  const [quantity, setQuantity] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('danger');
  const [validated, setValidated] = useState(false);
  window.INVENTORY_ITEMS_API_URL = 'https://localhost:7257/api/';

  useEffect(() => {
    if (props.item) {
      const { id } = props.item;
      setId(id);
    }
  }, [props.item]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setQuantity(parseInt(value));
    }
  };

  const submitGrant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      grantItem();
    }
    setValidated(true);
  };

  const grantItem = async () => {
    try {
      const response = await fetch(`${window.INVENTORY_ITEMS_API_URL}Items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          catalogItemId: id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error(`Could not grant the item: ${errorData.title}`);
      }

      if (props.toggle) {
        props.toggle();
      }
    } catch (err) {
      showAlert((err as Error).message);
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertColor('danger');
    setAlertVisible(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={submitGrant}>
      <Form.Group>
        <Form.Label htmlFor="userId">User Id:</Form.Label>
        <Form.Control type="text" name="userId" value={userId} readOnly required />
        <Form.Control.Feedback type="invalid">The User Id field is required</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="quantity">Quantity:</Form.Label>
        <Form.Control type="number" name="quantity" onChange={onChange} value={quantity} required />
        <Form.Control.Feedback type="invalid">The Quantity field is required</Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">Grant</Button>

      <Alert style={{ marginTop: "10px" }} variant={alertColor} show={alertVisible}>
        {alertMessage}
      </Alert>
    </Form>
  );
};

export default GrantItemForm;
