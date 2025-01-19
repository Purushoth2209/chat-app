import React, { useState, useEffect } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./../styles/chat/ProfilePage.css"

function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current profile info
    const profileId = localStorage.getItem('profileId');
    if (!profileId) return;

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/profile?profileId=${profileId}`);
        setUsername(response.data.username);
        setProfileImage(response.data.profileImage); // Assume profileImage URL from DB
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleUsernameChange = async () => {
    const profileId = localStorage.getItem('profileId');
    try {
      await axios.post('http://localhost:5000/api/auth/updateUsername', {
        profileId,
        newUsername: username,
      });
      alert('Username updated successfully');
    } catch (error) {
      setError('Error updating username');
    }
  };

  const handleProfileImageUpload = async (event) => {
    const profileId = localStorage.getItem('profileId');
    const formData = new FormData();
    formData.append('profileImage', event.target.files[0]);

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/uploadProfileImage?profileId=${profileId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileImage(response.data.profileImage); // Update the image URL after upload
    } catch (error) {
      setError('Error uploading profile image');
    }
  };

  const handleLogout = async () => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) return;

    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
      });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div>
        <Image src={profileImage || 'default-image.jpg'} roundedCircle width="150" height="150" />
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleUsernameChange}>Update Username</Button>
      </div>
      <div>
        <Form.Group>
          <Form.Label>Upload Profile Image</Form.Label>
          <Form.Control type="file" onChange={handleProfileImageUpload} />
        </Form.Group>
      </div>
      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Profile;
