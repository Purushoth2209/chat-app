import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/chat/chat.css';

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactSearchResults, setContactSearchResults] = useState([]);
  
  const navigate = useNavigate();

  // Handle logout by removing JWT token from localStorage and redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove JWT token from localStorage
    navigate('/login');  // Redirect to login page
  };

  // Clear JWT token when component unmounts (user presses back)
  useEffect(() => {
    return () => {
      localStorage.removeItem('token');
    };
  }, []);

  return (
    <Container fluid className="chat-container">
      <Row className="chat-row">
        <Col xs={3} className="leftbar">
          <LeftBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setContactSearchResults={setContactSearchResults} 
            contactSearchResults={contactSearchResults} 
            setContacts={setContacts}
            setCurrentContact={setCurrentContact}
          />
        </Col>
        <Col xs={9} className="rightbar">
          <RightBar 
            currentContact={currentContact} 
            messages={messages} 
            setMessages={setMessages} 
            setCurrentContact={setCurrentContact} 
          />
        </Col>
      </Row>
      <button onClick={handleLogout} className="logout-btn">Logout</button> {/* Logout button */}
    </Container>
  );
}

export default Chat;
