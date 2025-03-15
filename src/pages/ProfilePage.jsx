// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message,Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css'; // Add your profile page styles
import { Button } from 'react-bootstrap';
import ProfileEditForm from '../components/ProfileEditForm'; // Import the ProfileEditForm component
const { confirm } = Modal;
const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
  });
  const [products, setProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editForm, setEditForm] = useState({ // State for edit form values
    firstName: '',
    lastName: '',
    nickname: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
  });

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://swap-back-rh5j.onrender.com/reviews/${id}`);
        console.log('Full Response:', response.data);
        setReviews(response.data);
        
        const totalRating = response.data.reduce((acc, review) => acc + review.rating, 0);
        const average = totalRating / response.data.length;
        setAverageRating(average);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);


  useEffect(() => {
    // Fetch user profile and products
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://swap-back-rh5j.onrender.com/users/${id}`);
        setUser(response.data);
        setEditForm(response.data); // Initialize form with current user data
        console.log('Profile Owner Details:', response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`https://swap-back-rh5j.onrender.com/products/user/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUser();
    fetchUserProducts();
  }, [id]);

  useEffect(() => {
    // Fetch current user ID from localStorage
    const fetchCurrentUserId = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setCurrentUserId(userId);
        console.log('Logged-In User ID:', userId);
      } else {
        console.warn('No logged-in user ID found in localStorage');
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    // Check following status
    const checkFollowingStatus = async () => {
      if (currentUserId && id) {
        try {
          const response = await axios.get(`https://swap-back-rh5j.onrender.com/follow/${currentUserId}/following/${id}`);
          setIsFollowing(response.data);
        } catch (error) {
          console.error('Error checking follow status:', error);  
        }
      }
    };

    checkFollowingStatus();
  }, [currentUserId, id]);

  const handleFollow = async () => {
    Modal.confirm({
      title: 'Confirm Follow',
      content: 'คุณต้องการจะ follow ผู้ใช้นี้ไหม?',
      okText: 'ใข่',
      okType: 'primary',
      cancelText: 'ไม่ใช่',
      onOk: async () => {
        try {
          await axios.post(`https://swap-back-rh5j.onrender.com/follow/${currentUserId}/follow/${id}`);
          setIsFollowing(true);
          message.success('Followed successfully');
        } catch (error) {
          console.error('Error following user:', error);
          message.error('Failed to follow user. Please try again.');
        }
      },
    });
  };

  const handleUnfollow = async () => {
    Modal.confirm({
      title: 'Confirm Unfollow',
      content: 'คุณต้องการจะ unfollow ผู้ใช้นี้ไหม?',
      okText: 'ใข่',
      okType: 'danger',
      cancelText: 'ไม่ใช่',
      onOk: async () => {
        try {
          await axios.delete(`https://swap-back-rh5j.onrender.com/follow/${currentUserId}/unfollow/${id}`);
          setIsFollowing(false);
          message.success('Unfollowed successfully');
        } catch (error) {
          console.error('Error unfollowing user:', error);
          message.error('Failed to unfollow user. Please try again.');
        }
      },
      onCancel: () => {
        message.info('Unfollow cancelled');
      },
    });
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}?userId=${id}`);
  };
  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const handleCloseReviewsModal = () => {
    setShowAllReviews(false);
  };


  return (
    <div className="profile-page">
      <div className="profile-header bg">
        <div className="profile-header-content">
          <div className="profile-picture-container">
            <img 
              src={user.profilePicture || '/default-profile.png'} 
              alt="Profile" 
              className="profile-image" 
            />
          </div>
          <div className="profile-details" >
            <h1>{user.firstName} {user.lastName}</h1>
            <div className="profile-actions">
              {currentUserId && currentUserId === id && (
                <Button variant="primary" onClick={handleEditToggle}>แก้ไขโปรไฟล์</Button>
              )}
              <div className="profile-reviews">
                <h3>คะแนนรีวิว: {averageRating.toFixed(1)} ⭐</h3>
                {reviews.length > 0 ? (
                  <div>
                    <div className="review-card">
                      <p><strong>{reviews[0].userfrom.firstName}:</strong> {reviews[0].content}</p>
                      <p>คะแนน: {reviews[0].rating} ⭐</p>
                    </div>
                    {reviews.length > 1 && (
                      <Button type="link" onClick={handleShowAllReviews}>
                        ดูรีวิวทั้งหมด
                      </Button>
                    )}
                  </div>
                ) : (
                  <p>ยังไม่มีรีวิว</p>
                )}
              </div>

              {currentUserId && currentUserId !== id && (
                isFollowing ? (
                  <Button variant="danger" onClick={handleUnfollow}>ยกเลิกติดตาม</Button>
                ) : (
                  <Button variant="primary" onClick={handleFollow}>ติดตาม</Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info">
        {isEditing ? (
          <ProfileEditForm 
            editForm={editForm}
            handleChange={(e) => {
              const { name, value } = e.target;
              setEditForm(prev => ({ ...prev, [name]: value }));
            }}
            handleSave={async () => {
              try {
                await axios.patch(`https://swap-back-rh5j.onrender.com/users/${id}`, editForm);
                setUser(editForm);
                setIsEditing(false);
              } catch (error) {
                console.error('Error updating profile:', error);
              }
            }}
            handleEditToggle={handleEditToggle}
          />
        ) : (
          <>
            <p>อีเมล: {user.email}</p>
            <p>เบอร์โทร: {user.phoneNumber}</p>
            <p>ที่อยู่: {user.address}</p>
            <Button variant="secondary" onClick={handleBack}>ย้อนกลับ</Button>
          </>
        )}
      </div>

      <div className="profile-products-section">
        <h2>โพสต์สินค้าโดย {user.firstName}</h2>
        {products.length > 0 ? (
          products.map((product) => (
            <div className="profile-product-card" key={product.id} onClick={() => handleProductClick(product.id)}>
              <img 
                src={product.image[0] || '/default-product.png'} 
                alt={product.name} 
                className="profile-product-image" 
              />
              <div className="profile-product-info">
                <h3 className="profile-product-name">{product.name}</h3>
                <span className="profile-product-status" style={{ backgroundColor: getStatusColor(product.status) }}>
                {product.status === 'available' ? 'พร้อมแลก' : 'แลกแล้ว'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>ไม่มีสินค้า.</p>
        )}
      </div>
      <Modal
        title="รีวิวทั้งหมด"
        visible={showAllReviews}
        onCancel={handleCloseReviewsModal}
        footer={null}
        width={600}
      >
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <p><strong>{review.userfrom.firstName}:</strong> {review.content}</p>
            <p>คะแนน: {review.rating} ⭐</p>
          </div>
        ))}
      </Modal>

    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return 'green';
    case 'complete':
      return 'red';
    case 'discontinued':
      return 'blue';
    default:
      return 'gray';
  }
};

export default ProfilePage;