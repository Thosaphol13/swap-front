import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/MainPage.css';
import FollowersSection from '../components/FollowersSection';
import Sidebar from '../components/Sidebar';
import ProductsSection from '../components/ProductsSection';
import { Modal, message,Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import confirm from 'antd/es/modal/confirm';
import ProductDetail from './productDetail';

const MainPage = () => {
  const { id } = useParams();
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    role: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct,  setSelectedProduct] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showOffersDetail, setShowOffersDetail] = useState(false);
  const [dropdownProductId, setDropdownProductId] = useState(null); // New state for dropdown menu
  const [searchProduct, setSearchProduct] = useState(''); // Renamed state for consistency
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectIWant, setSelectIWant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followedUsers, setFollowedUsers] = useState([]);
const [filterByFollow, setFilterByFollow] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, productsResponse, followersResponse, SearchProductResponse,categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:3001/users/${id}`),
          axios.get('http://localhost:3001/products'),
          axios.get(`http://localhost:3001/follow/${id}/followers`),
          axios.get(`http://localhost:3001/products/name/${name}`),
          axios.get('http://localhost:3001/categories')
        ]);
        setUser(userResponse.data);
        setIsAdmin(userResponse.data.role === 'admin');
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data); // Initialize filtered products
        setFollowers(followersResponse.data);
        setSearchProduct(SearchProductResponse.data);
        setCategories(categoriesResponse.data);
        console.log('Profile User:', userResponse.data); // Log profile user details
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/follow/${user.id}/following`);
        const data = await response.json();
        setFollowedUsers(data);
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };
  
    if (filterByFollow) {
      fetchFollowedUsers();
    }
  }, [filterByFollow, user.id]);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  

  useEffect(() => {
    let filtered = products;
  
    // กรองตามหมวดหมู่
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category?.id === selectedCategory.id);
    }
    if (selectIWant) {
      filtered = filtered.filter(product => {
        return product.categoryWantId?.id === selectIWant;
      });
      
    }
  
    // กรองตามข้อความค้นหา
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.status.toLowerCase().includes(searchProduct.toLowerCase())
    );
  
    // กรองตามสถานะ
    if (selectedStatus) {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }
    console.log("เลือกประเภทสินค้าที่ต้องการ:", selectIWant);

    // กรองตามผู้ใช้ที่ติดตาม
    if (filterByFollow) {
      filtered = filtered.filter(product => followedUsers.some(followed => followed.id === product.user.id));
    }
  
    setFilteredProducts(filtered);
  }, [searchProduct, products, selectedCategory, filterByFollow, followedUsers, selectedStatus,selectIWant]);
  
  const handleCategoryWantChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    setSelectIWant(categoryId);  // ตรวจสอบว่า categoryId ได้รับค่าเป็น number หรือไม่
  };
  
  

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchProduct, products]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleProfileClick = (profileId) => {
    console.log('Profile Clicked ID:', profileId);
    navigate(`/profile/${profileId}`);
  };

  const toggleProductForm = () => {
    setShowProductForm(prev => !prev);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
  };

  const handleExchangeClick = (product) => {
    setSelectedProduct(product);
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setSelectedProduct(null);
  };

  const handleOfferClick = () => {
    setShowOffersDetail(true);
  };

  const handleCloseOffersDetail = () => {
    setShowOffersDetail(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}?userId=${id}`);
  };
  const handleAdminClick = () => {  
    navigate(`/admin/${id}`);
  };

  const handleReportProduct = async (productId) => {
    const { confirm } = Modal;
    let details;
    confirm({
      title: 'รายงานสินค้า',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          กรุณากรอกเหตุผลในการรายงานสินค้านี้:
          <Input.TextArea placeholder="เหตุผล" />
          <br />
          <br />
          ระบุรายละเอียดเพิ่มเติม (ถ้ามี):
          <Input.TextArea placeholder="รายละเอียด" onChange={(e) => details = e.target.value} />
        </div>
      ),
      okText: 'Report',
      cancelText: 'Cancel',
      onOk: async () => {
        const reason = document.querySelector('textarea').value;
        if (!reason) {
          message.error('Reason is required');
          return;
        }
        try {
          const response = await axios.post(`http://localhost:3001/reports`, {
            productId,  // Include the productId in the request
            userId: user.id,  // Assuming user.id is available in your context or state
            reason,
            details,
          });
          message.success('รายงานสินค้าสำเร็จ!');
        } catch (error) {
          message.error(error.response?.data?.message || "ไม่สามารถรายงานสินค้าได้");
        }
      },
    });
  };
  const { confirm } = Modal;
  
  const handleDeleteProduct = (productId) => {
    confirm({
      title: 'Confirm delete',
      icon: <ExclamationCircleOutlined />,
      content: 'คุณต้องการลบสินค้านี้ไหม?',
      okText: 'ใช่', 
      okType: 'danger', 
      cancelText: 'ไม่ใช่',
      cancelType: 'danger', 
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/products/${productId}`);
          setProducts(products.filter((product) => product.id !== productId));
          setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
          message.success('Product deleted successfully');
        } catch (error) {
          console.error('Error deleting product:', error);
          message.error('Failed to delete product');
        }
      },
      onCancel: () => {
        message.info('Deletion cancelled');
      },
    });
  };

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    const selected = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(selected || null);
  };
  
  
  
  
  

  const handleSearchChange = (event) => {
    setSearchProduct(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div> {/* Add a spinner */}
      </div>
    );
  }

  return (
    <div className="main-page">
     <Header
        searchProduct={searchProduct}
        filterByFollow={filterByFollow} 
        selectedStatus={selectedStatus}
        handleCategoryWantChange={handleCategoryWantChange}
        setSelectedStatus={setSelectedStatus}
        setFilterByFollow={setFilterByFollow}
        handleSearchChange={handleSearchChange}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        handleOfferClick={handleOfferClick}
        handleLogout={handleLogout}
      />

      <div className="content">
      <Sidebar 
          user={user} 
          isAdmin={isAdmin} 
          handleProfileClick={handleProfileClick} 
          handleAdminClick={handleAdminClick} 
        />
      <ProductsSection 
          user={user}
          filteredProducts={filteredProducts}
          showProductForm={showProductForm}
          filterByFollow={filterByFollow} 
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          setFilterByFollow={setFilterByFollow}
          toggleProductForm={toggleProductForm}
          handleReportProduct={handleReportProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleExchangeClick={handleExchangeClick}
          selectedProduct={selectedProduct}
          showOfferForm={showOfferForm}
          handleCloseOfferForm={handleCloseOfferForm}
          showOffersDetail={showOffersDetail}
          handleCloseOffersDetail={handleCloseOffersDetail}
          dropdownProductId={dropdownProductId}
          setDropdownProductId={setDropdownProductId}
          searchProduct={searchProduct}
          handleProductClick={handleProductClick}
          handleProfileClick={handleProfileClick}
        />
          <FollowersSection followers={followers} handleProfileClick={handleProfileClick} />
      </div>
    </div>
  );
};

export default MainPage;
