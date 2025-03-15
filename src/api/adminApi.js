import axios from "axios";
const API_BASE_URL = 'https://swap-back-rh5j.onrender.com';
// ฟังก์ชันดึงรายงาน
export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to load reports. Please try again.");
  }
};

// ฟังก์ชันดึงรายชื่อผู้ใช้ที่ถูกแบน
export const fetchBanList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ban-list`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching ban list.");
  }
};

// ฟังก์ชันลบสินค้าจากรายการ
export const deleteProduct = async (productId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${productId}`);
  } catch (error) {
    throw new Error("Error deleting product!");
  }
};

// ฟังก์ชันยกเลิกการแบนผู้ใช้
export const unbanUser = async (userId) => {
  try {
    await axios.post(`${API_BASE_URL}/${userId}`);
  } catch (error) {
    throw new Error("Failed to unban user. Please try again.");
  }
};
export const getReportedUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reportUser`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reported users:", error);
      throw error;
    }
  };
  
  // ฟังก์ชันเปลี่ยนสถานะของผู้ใช้ (แบน/ยกเลิกแบน)
  export const changeUserStatus = async (userId, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${userId}/change-status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error changing user status:", error);
      throw error;
    }
  };
