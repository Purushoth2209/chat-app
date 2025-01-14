import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import '../styles/chat/rightbar.css';  // Importing the RightBar CSS

function RightBar({ currentContact, messages, message, setMessage, setMessages, setCurrentContact }) {
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    const newMessage = { sender: 'User 1', content: message };
    setMessages([...messages, newMessage]);

    // Replace with actual API endpoint to send the message
    try {
      axios.post(`/api/messages/send`, { to: currentContact.profileId, message });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Reset the messages if no contact is selected
    if (!currentContact) {
      setMessages([]);
    }
  }, [currentContact, setMessages]);

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
      setCurrentContact(null); // Revert to default view
    }
  };

  useEffect(() => {
    // Listen for the Escape key press
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [setCurrentContact]);

  return (
    <div className="rightbar-container">
      {currentContact ? (
        <>
          <h4 className="contact-name">{currentContact.username}</h4>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'User 1' ? 'message-sent' : 'message-received'}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="message-input-container">
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="message-input"
            />
            <Button variant="primary" className="send-btn" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </>
      ) : (
        <p className="select-contact-msg">Select a contact to start chatting</p>
      )}
    </div>
  );
}

export default RightBar;
