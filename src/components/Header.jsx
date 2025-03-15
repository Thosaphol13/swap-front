import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import confirm from 'antd/es/modal/confirm';

const Header = ({ searchProduct, handleSearchChange, handleCategoryChange, categories, handleOfferClick, handleLogout,filterByFollow, 
  setFilterByFollow,setSelectedStatus,selectedStatus,handleCategoryWantChange  }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => setIsOpen(!isOpen);

  return (
    <header className="header">
      <img
        className="logo"
        src="https://static.vecteezy.com/system/resources/previews/017/080/209/non_2x/letter-s-switch-arrow-swap-change-transfer-reload-opposite-reverse-repeat-line-logo-design-vector.jpg"
        alt="Switch Swap"
      />
      <input
        className="search-bar"
        type="text"
        placeholder="ค้นหา"
        value={searchProduct}
        onChange={handleSearchChange}
      />
      <div
  className="filter-dropdown"
  style={{ position: "relative", display: "inline-block" }}
>
  <button
    className="category-select"
    onClick={handleToggleDropdown}
    style={{
      // backgroundColor: "#007bff",
      color: "black",
      border: "none",
      padding: "10px 15px",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
      border: "1px solid black",
    }}
  >
    กรอกสินค้า
  </button>

  {isOpen && (
    <div
      className="dropdown-menu"
      style={{
        position: "absolute",
        top: "100%",
        left: "0",
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1,
        width: "200px",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <select
        onChange={handleCategoryChange}
        className="category-select"
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">ประเภทสินค้าทั้งหมด</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="category-select"
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">เลือกสถานะ</option>
        <option value="available">พร้อมแลก</option>
        <option value="complete">แลกแล้ว</option>
      </select>

      <select
        onChange={handleCategoryWantChange}
        className="category-select"
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">ประเภทสินค้าที่ต้องการ</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button
        className="category-select"
        onClick={() => setFilterByFollow((prev) => !prev)}
        style={{
          backgroundColor: filterByFollow ? "#28a745" : "#6c757d",
          color: "white",
          border: "none",
          padding: "8px",
          cursor: "pointer",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        {filterByFollow ? "แสดงสินค้าทั้งหมด" : "แสดงเฉพาะผู้ใช้ที่ติดตาม"}
      </button>
    </div>
      )}
    </div>

      <div className="menu-icons">
        <button className="icon-btn bell-icon" onClick={handleOfferClick} type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.flaticon.com/128/2645/2645890.png"
            alt="Notification Icon"
          />
        </button>
        <button className="icon-btn menu-icon" 
          onClick={() => confirm({
            title: 'Confirm Logout',
            icon: <ExclamationCircleOutlined />,
            content: 'คุณต้องการออกจากระบบหรือไม่?',
            okText: 'ใช่',
            okType: 'danger',
            cancelText: 'ยกเลิก', 
            onOk: () => handleLogout(),  // "ใช่" จะทำการออก
            onCancel() {},
          })} 
          type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.freepik.com/256/10024/10024508.png?ga=GA1.1.1002826414.1720595920&semt=ais_hybrid"
            alt="Menu Icon"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
