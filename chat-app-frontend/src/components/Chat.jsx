import React, { useState, useEffect } from 'react';
import './styles/Chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(['Hello!', 'How are you?']);

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span>{msg}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="chat-input"
        placeholder="Type a message..."
      />
      <button className="send-btn">Send</button>
    </div>
  );
};

export default Chat;
