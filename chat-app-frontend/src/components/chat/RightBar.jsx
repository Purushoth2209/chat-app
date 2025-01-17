import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';  // Import axios to make API requests
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import '../styles/chat/rightbar.css';

const socket = io('http://localhost:5000');

function RightBar({ currentContact, messages, setMessages, setCurrentContact }) {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  // Register user profileId when component mounts
  useEffect(() => {
    const profileId = localStorage.getItem('profileId');
    if (profileId) {
      socket.emit('register', profileId);
      console.log('User registered with socketId');
    }
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const senderId = localStorage.getItem('profileId'); 

    if (!senderId) {
      console.log('Sender profileId not found in localStorage');
      return;
    }

    const receiverId = currentContact ? currentContact.profileId : null;
    if (!receiverId) {
      console.log('Receiver profileId not found.');
      return;
    }

    const newMessage = { sender: 'User 1', content: message, senderId, receiverId };
    console.log('Sending message:', newMessage);

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit('sendMessage', { senderId, receiverId, content: message });

    setMessage('');
  };

  const handleLogout = async () => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) {
      console.log('ProfileId not found in localStorage');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/logout', { profileId });
      console.log(response.data.message);  // Handle success response

      localStorage.removeItem('profileId');
      localStorage.removeItem('token');
      console.log('Logged out successfully');

      setMessages([]);
      setCurrentContact(null);

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    console.log('Current contact changed:', currentContact);
    if (!currentContact) {
      console.log('No current contact selected. Clearing messages...');
      setMessages([]);
    }
  }, [currentContact, setMessages]);

  useEffect(() => {
    console.log('Setting up socket listener for "receiveMessage"...');
    socket.on('receiveMessage', (message) => {
      console.log('Message received from socket:', message);
      if (currentContact && message.senderId === currentContact.profileId) {
        console.log('Message is for the current contact, updating messages...');
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        // If the message is not for the current contact, it may be stored for future reference
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      console.log('Removing socket listener for "receiveMessage"...');
      socket.off('receiveMessage');
    };
  }, [currentContact, setMessages]);

  const handleEscapeKey = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed, deselecting current contact...');
        setCurrentContact(null);
      }
    },
    [setCurrentContact]
  );

  useEffect(() => {
    console.log('Adding event listener for Escape key...');
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      console.log('Removing event listener for Escape key...');
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  return (
    <div className="rightbar-container">
      {currentContact ? (
        <>
          <h4 className="contact-name">{currentContact.username}</h4>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'User 1' ? 'message-sent' : 'message-received'}`}
              >
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
          <Form className="message-input-container">
            <Form.Control
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />
            <Button onClick={handleSendMessage} className="send-message-btn">
              Send
            </Button>
          </Form>
        </>
      ) : (
        <div className="no-contact-selected">
          <p className="text-muted">Select a contact to start chatting.</p>
        </div>
      )}

      <Button 
        variant="danger" 
        className="logout-btn" 
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}

export default RightBar;
