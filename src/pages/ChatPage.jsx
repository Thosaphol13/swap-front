import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ChatPage.css'; // Import your CSS file

const Chat = ({ fromUserId, toUserId, productId, onClose }) => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // Store the new message
  const [loading, setLoading] = useState(true); // Loading state
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
  });

  // Fetch user details of the recipient (toUserId)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${toUserId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [toUserId]);

  // Fetch chat messages based on the productId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/chats/getByProductId/${productId}`);
        setMessages(response.data.map((msg) => ({
          ...msg,
          product: msg.product || null, // Include product details if available
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
  }, [productId]); // Only re-fetch if productId changes

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages
    try {
      const response = await axios.post('http://localhost:3001/chats/create', {
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message: newMessage,
        productId, // Add productId here
      });
      const newChat = response.data;

      setMessages([
        ...messages,
        {
          ...newChat,
          sender: { id: fromUserId, firstName: 'You', profilePicture: '' },
          receiver: { id: toUserId, ...user },
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div>Loading chat...</div>; // Show loading state if data is not ready

  return (
    <div className="chat-modal">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/40'} // Default image if profile picture is not available
            alt={`${user.firstName} ${user.lastName}`}
            className="profile-pic"
          />
          <div className="header-info">
            <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
            <span className="user-status">Active 6m ago</span> {/* You can update this with real status */}
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Chat Body */}
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender.id === fromUserId ? 'message-sent' : 'message-received'}
          >
            {msg.product && (
              <div className="product-info">
                <span>Product: {msg.product.name}</span>
              </div>
            )}
            <span className="message-text">{msg.message}</span>
            <div className="message-info">
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Footer */}
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="message-input"
        />
        <button className="send-btn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
