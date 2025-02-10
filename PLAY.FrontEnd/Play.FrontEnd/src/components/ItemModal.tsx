import React, { useState, Fragment, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ItemForm from './ItemForm';

const ItemModal: React.FC<{ isNew: boolean, className?: string, addItemToState?: (item: any) => void, updateItemIntoState?: (id: number) => void, item?: any, refreshCatalog?: () => void }> = (props) => {
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  

  const toggle = () => setModal(!modal);

  const { isNew, className, addItemToState, updateItemIntoState, item, refreshCatalog } = props;
  const title = isNew ? 'Add Item' : 'Edit Item';

  const fetchItems = async () => {
    try {
      const response = await fetch('https://localhost:7148/api/Items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
      console.log('Update item',data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <Fragment>
      {isNew ? (
        <Button
          variant="primary"
          onClick={toggle}
          style={{ minWidth: "200px" }}>Add</Button>
      ) : (
        <Button
          variant="primary"
          onClick={toggle}>Edit</Button>
      )}
      <Modal show={modal} className={className} onHide={toggle}>
        <Modal.Header closeButton>{title}</Modal.Header>
        <Modal.Body>
          <ItemForm
            addItemToState={addItemToState}
            updateItemIntoState={updateItemIntoState}
            toggle={toggle}
            item={item}
            refreshCatalog={refreshCatalog} />
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default ItemModal;
