import React, { useState, useEffect } from 'react';
import { ListGroup, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import '../styles/chat/leftbar.css';  // Importing the LeftBar CSS

function LeftBar({ searchQuery, setSearchQuery, setContactSearchResults, contactSearchResults, setContacts, setCurrentContact, profileId }) {
  const [newContactModal, setNewContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [error, setError] = useState('');

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    searchContacts(e.target.value);
  };

  // Filter contacts based on the search query
  const searchContacts = (query) => {
    const filteredContacts = contactSearchResults.filter((contact) =>
      contact.username.toLowerCase().includes(query.toLowerCase()) ||
      contact.phoneNumber.includes(query)
    );
    setContactSearchResults(filteredContacts);
  };

  // Handle selecting a contact from the list
  const handleSelectContact = (contact) => {
    setCurrentContact(contact);
  };

  // Handle adding a new contact
  const handleAddContact = (contact) => {
    setContacts((prevContacts) => [...prevContacts, contact]);
  };

  // Show the modal for creating a new contact
  const handleShowModal = () => {
    setNewContactModal(true);
  };

  // Close the modal and reset input fields
  const handleCloseModal = () => {
    setNewContactModal(false);
    setNewContactName('');
    setNewContactNumber('');
    setError('');
  };

  // Create a new contact
  const handleCreateContact = async () => {
    const profileId = localStorage.getItem('profileId'); // Retrieve the profileId from local storage

    if (!profileId) {
      console.error('profileId is not found in local storage');
      setError('User is not logged in. Please log in to add contacts.');
      return;
    }

    if (!newContactName || !newContactNumber) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/search?query=${newContactNumber}`
      );

      if (response.status === 200 && response.data.user) {
        const contactProfileId = response.data.user.profileId;

        const addContactResponse = await axios.post(
          'http://localhost:5000/api/auth/addContact',
          {
            profileId: profileId,
            contactName: newContactName,
            contactProfileId: contactProfileId,
            contactPhoneNumber: newContactNumber,
          }
        );

        if (addContactResponse.status === 200) {
          setContacts((prevContacts) => [
            ...prevContacts,
            { username: newContactName, phoneNumber: newContactNumber, profileId: contactProfileId },
          ]);
          handleCloseModal();
        } else {
          setError(addContactResponse.data.message);
        }
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      setError('Error occurred while adding the contact');
    }
  };

  return (
    <div className="leftbar-container">
      <h4 className="contacts-title">Contacts</h4>
      
      {/* Search bar */}
      <Form.Control
        type="text"
        placeholder="Search contacts"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      {/* Add new contact button */}
      <Button variant="outline-primary" onClick={handleShowModal} className="add-contact-btn">
        <i className="bi bi-plus"></i> Add Contact
      </Button>

      {/* Contact list */}
      <ListGroup className="contacts-list">
        {contactSearchResults.length > 0 ? (
          contactSearchResults.map((contact) => (
            <ListGroup.Item
              key={contact.profileId}
              action
              onClick={() => handleSelectContact(contact)}
              className="contact-item"
            >
              <div className="contact-info">
                <span>{contact.username}</span>
                {/* Add contact button inside the ListGroup item */}
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleAddContact(contact)}
                  className="add-btn"
                >
                  Add
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <p className="no-results">No results</p>
        )}
      </ListGroup>

      {/* Modal for creating new contact */}
      <Modal show={newContactModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="contactName">
              <Form.Label>Contact Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="contactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={newContactNumber}
                onChange={(e) => setNewContactNumber(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateContact}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LeftBar;
