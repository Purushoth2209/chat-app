import React, { useState } from 'react';
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

  return (
    <Container fluid className="chat-container">
      <Row className="chat-row">
        {/* Left Sidebar */}
        <Col xs={3} className="leftbar">
          <LeftBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setContactSearchResults={setContactSearchResults} 
            contactSearchResults={contactSearchResults} 
            setContacts={setContacts}
            setCurrentContact={setCurrentContact}
            userId="userId" // Replace with actual user ID logic
          />
        </Col>

        {/* Right Sidebar (Chat Content) */}
        <Col xs={9} className="rightbar">
          <RightBar 
            currentContact={currentContact} 
            messages={messages} 
            message={message} 
            setMessage={setMessage} 
            setMessages={setMessages}
            setCurrentContact={setCurrentContact}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
