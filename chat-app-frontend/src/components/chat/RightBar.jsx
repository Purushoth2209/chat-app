import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/chat/rightbar.css';

const socket = io('http://localhost:5000');

function RightBar({ currentContact, setCurrentContact }) {
  const [message, setMessage] = useState('');
  const [messagesByContact, setMessagesByContact] = useState({}); // Object to store messages per contact
  const navigate = useNavigate();

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

    // Update messages for the current contact
    setMessagesByContact((prev) => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), newMessage],
    }));

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
      console.log(response.data.message);

      localStorage.removeItem('profileId');
      localStorage.removeItem('token');
      console.log('Logged out successfully');

      setMessagesByContact({});
      setCurrentContact(null);

      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up socket listener for "receiveMessage"...');
    socket.on('receiveMessage', (message) => {
      console.log('Message received from socket:', message);

      const { senderId } = message;
      setMessagesByContact((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), message],
      }));
    });

    return () => {
      console.log('Removing socket listener for "receiveMessage"...');
      socket.off('receiveMessage');
    };
  }, []);

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

  // Get messages for the current contact
  const currentMessages = currentContact ? messagesByContact[currentContact.profileId] || [] : [];

  return (
    <div className="rightbar-container">
      {currentContact ? (
        <>
          <h4 className="contact-name">{currentContact.username}</h4>
          <div className="messages-container">
            {currentMessages.map((msg, index) => (
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
