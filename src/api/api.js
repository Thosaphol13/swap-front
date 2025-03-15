import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// ฟังก์ชันดึงข้อเสนอที่ได้รับ
export const fetchReceivedOffers = async (userId) => {
  return axios.get(`${API_BASE_URL}/offers/receiver/${userId}`);
};

// ฟังก์ชันดึงข้อเสนอที่ส่งไป
export const fetchSentOffers = async (userId) => {
  return axios.get(`${API_BASE_URL}/offers/sent/${userId}`);
};

// ฟังก์ชันรับข้อเสนอ
export const acceptOffer = async (offerId) => {
  return axios.post(`${API_BASE_URL}/offers/accept`, { offerId });
};

// ฟังก์ชันปฏิเสธข้อเสนอ
export const rejectOffer = async (offerId) => {
  return axios.post(`${API_BASE_URL}/offers/reject`, { offerId });
};

// ฟังก์ชันอัปเดตประเภทการจัดส่ง
export const updateDeliveryType = async (offerId, deliveryType) => {
  return axios.post(`${API_BASE_URL}/offers/update-delivery-type`, {
    offerId,
    deliveryType,
  });
};

// ฟังก์ชันทำเครื่องหมายว่าสินค้าสำเร็จ
export const markProductAsCompleted = async (productId) => {
  return axios.post(`${API_BASE_URL}/products/complete`, { productId });
};

// ฟังก์ชันตรวจสอบว่ามีการรีวิวไปแล้วหรือไม่
export const checkIfReviewed = async (userFromId, productId) => {
  return axios.get(`${API_BASE_URL}/reviews/has-reviewed/${userFromId}/${productId}`);
};

// ฟังก์ชันส่งรีวิว
export const submitReview = async (userFromId, userToId, reviewContent, rating, productId) => {
  return axios.post(`${API_BASE_URL}/reviews`, {
    userFromId,
    userToId,
    content: reviewContent,
    rating,
    productId
  });
};
export const createReportUser = async (reportData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reportUser/create`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report user:', error);
      throw error;
    }
  };
