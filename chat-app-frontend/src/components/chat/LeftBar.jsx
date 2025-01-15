import React, { useState, useEffect, useCallback } from 'react';
import { ListGroup, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/chat/leftbar.css';

const socket = io('http://localhost:5000');

function LeftBar({ searchQuery, setSearchQuery, setContactSearchResults, contactSearchResults, setCurrentContact }) {
  const [newContactModal, setNewContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');
  const [error, setError] = useState('');
  const [contacts, setContactsState] = useState([]);

  const fetchContacts = useCallback(async () => {
    console.log('Fetching contacts...');
    try {
      const profileId = localStorage.getItem('profileId');
      if (!profileId) {
        console.error('Profile ID not found.');
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/auth/fetchContact?profileId=${profileId}`);
      if (response.status === 200) {
        console.log('Contacts fetched successfully:', response.data.contacts);
        setContactsState(response.data.contacts);
        setContactSearchResults(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, [setContactSearchResults]);

  useEffect(() => {
    console.log('Initializing component...');
    fetchContacts();
    socket.on('receiveMessage', (message) => console.log('Message received:', message));
    return () => {
      console.log('Cleaning up socket listeners...');
      socket.off('receiveMessage');
    };
  }, [fetchContacts]);

  const handleSearchChange = (e) => {
    console.log('Search query changed:', e.target.value);
    setSearchQuery(e.target.value);
    searchContacts(e.target.value);
  };

  const searchContacts = (query) => {
    console.log('Searching contacts with query:', query);
    const filteredContacts = contacts.filter(
      (contact) =>
        contact.username.toLowerCase().includes(query.toLowerCase()) || contact.phoneNumber.includes(query)
    );
    console.log('Filtered contacts:', filteredContacts);
    setContactSearchResults(filteredContacts);
  };

  const handleSelectContact = (contact) => {
    console.log('Contact selected:', contact);
    setCurrentContact(contact);
  };

  const handleShowModal = () => {
    console.log('Showing Add Contact modal...');
    setNewContactModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing Add Contact modal...');
    setNewContactModal(false);
    setNewContactName('');
    setNewContactNumber('');
    setError('');
  };

  const handleCreateContact = async () => {
    console.log('Creating new contact...');
    const profileId = localStorage.getItem('profileId');
    if (!profileId) {
      console.error('User not logged in.');
      setError('User not logged in.');
      return;
    }
    if (!newContactName || !newContactNumber) {
      console.error('Validation failed. Fields missing.');
      setError('All fields are required.');
      return;
    }
    try {
      console.log('Searching user by phone number...');
      const searchResponse = await axios.get(`http://localhost:5000/api/auth/search?query=${newContactNumber}`);
      if (searchResponse.status === 200 && searchResponse.data.user) {
        console.log('User found:', searchResponse.data.user);
        const { profileId: contactProfileId } = searchResponse.data.user;
        console.log('Adding contact...');
        const addContactResponse = await axios.post('http://localhost:5000/api/auth/addContact', {
          profileId,
          contactName: newContactName,
          contactProfileId,
          contactPhoneNumber: newContactNumber,
        });
        if (addContactResponse.status === 200) {
          console.log('Contact added successfully.');
          handleCloseModal();
          fetchContacts();
        } else {
          console.error('Error adding contact:', addContactResponse.data.message);
          setError(addContactResponse.data.message);
        }
      } else {
        console.error('User not found.');
        setError('User not found.');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      setError('An error occurred while adding the contact.');
    }
  };

  return (
    <div className="leftbar-container">
      <h4 className="contacts-title">Contacts</h4>
      <Form.Control
        type="text"
        placeholder="Search contacts"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <Button variant="outline-primary" onClick={handleShowModal} className="add-contact-btn mb-3">
        <i className="bi bi-plus"></i> Add Contact
      </Button>
      <ListGroup className="contacts-list">
        {contactSearchResults.length > 0 ? (
          contactSearchResults.map((contact) => (
            <ListGroup.Item key={contact.profileId} action onClick={() => handleSelectContact(contact)}>
              <div>
                <strong>{contact.username}</strong>
                <br />
                <small>{contact.phoneNumber}</small>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-muted text-center">No results found.</p>
        )}
      </ListGroup>
      <Modal show={newContactModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contact name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone number"
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
