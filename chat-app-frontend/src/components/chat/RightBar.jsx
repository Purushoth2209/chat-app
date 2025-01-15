import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import '../styles/chat/rightbar.css';

const socket = io('http://localhost:5000');

function RightBar({ currentContact, messages, setMessages, setCurrentContact }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Retrieve the sender's profileId from localStorage
    const senderId = localStorage.getItem('profileId'); 

    // Ensure the senderId exists
    if (!senderId) {
      console.log('Sender profileId not found in localStorage');
      return;
    }

    // Ensure that currentContact exists and has a profileId
    const receiverId = currentContact ? currentContact.profileId : null;
    if (!receiverId) {
      console.log('Receiver profileId not found.');
      return;
    }

    const newMessage = { sender: 'User 1', content: message, senderId, receiverId };
    console.log('Sending message:', newMessage);

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Emit the message along with senderId and receiverId
    socket.emit('sendMessage', { 
      senderId, 
      receiverId, 
      content: message
    });
    console.log('Message sent to socket:', { senderId, receiverId, content: message });

    setMessage('');
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
    </div>
  );
}

export default RightBar;
