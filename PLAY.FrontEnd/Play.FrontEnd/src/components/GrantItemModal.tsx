import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import GrantItemForm from './GrantItemForm';

const GrantItemModal: React.FC<{ item: any, className?: string }> = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={toggle}>Grant</Button>
      <Modal show={modal} className={props.className} onHide={toggle}>
        <Modal.Header closeButton>Grant {props.item.name}</Modal.Header>
        <Modal.Body>
          <GrantItemForm
            toggle={toggle}
            item={props.item}/>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default GrantItemModal;
