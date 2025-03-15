import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, List } from 'antd';
import { useNavigate } from "react-router-dom";
import { fetchReports, fetchBanList, deleteProduct, unbanUser } from '../api/adminApi'; 
import '../css/Admin.css';
import ReportUser from '../components/ReportUser';
import axios from "axios";
const Admin = () => {
  const [currentSection, setCurrentSection] = useState(""); 
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reports, setReports] = useState([]);
  const [banList, setBanList] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = (section) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    if (currentSection === "report") {
      const loadReports = async () => {
        try {
          const reportsData = await fetchReports();
          setReports(reportsData);
        } catch (err) {
          setError(err.message);
        }
      };
      loadReports();
    }
  }, [currentSection]);

  useEffect(() => {
    if (currentSection === "banList") {
      const loadBanList = async () => {
        try {
          const banListData = await fetchBanList();
          setBanList(banListData);
        } catch (err) {
          setError(err.message);
        }
      };
      loadBanList();
    }
  }, [currentSection]);

  const handleDeleteProduct = async (productId) => {
    Modal.confirm({
      title: 'คุณต้องการลบสินค้านี้ไหม?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteProduct(productId);
          setSuccess("Product deleted successfully!");
          setReports(prevReports => prevReports.filter(report => report.product.id !== productId));
        } catch (error) {
          setError(error.message);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleUnbanUser = async (userId) => {
    if (window.confirm("Are you sure you want to unban this user?")) {
      try {
        await unbanUser(userId);
        setSuccess("User unbanned successfully!");
        setBanList(prevList => prevList.filter(user => user.id !== userId));
      } catch (error) {
        setError(error.message);
      }
    }
  };
  const handleSubmit = async (values) => {
    setError("");
    setSuccess("");
    try {
      await axios.post("https://swap-back-rh5j.onrender.com/categories", { name: values.categoryName });
      setSuccess("Category added successfully!");
      setCategoryName(""); // Clear input field
    } catch (error) {
      setError("Failed to add category. Please try again.");
      console.error("Error adding category:", error);
    }
  };
  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Admin Management</h1>
        <nav>
          <Button onClick={() => setCurrentSection("addCategory")}>เพิ่มประเภทสินค้า</Button>
          <Button onClick={() => setCurrentSection("report")}>รายงานโพสต์</Button>
          <Button onClick={() => setCurrentSection("banList")}>รายชื่อผู้ใช้ที่ถูกแบน</Button>
          <Button onClick={() => navigate(-1)}>ย้อนกลับ</Button>
        </nav>
      </header>

      <main>
      {currentSection === "addCategory" && (
          <div className="category-section">
            <h2>เพิ่มประเภทสินค้าใหม่</h2>
            <Form
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                name="categoryName"
                label="ชื่อประเภทสินค้า"
                rules={[{ required: true, message: "Please enter category name!" }]}
              >
                <Input
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
        {currentSection === "report" && (
          <div className="report-section">
            <h2>รายงาน</h2>
            {reports.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={reports}
                renderItem={(report) => (
                  <List.Item style={{ padding: "10px" }}>
                    <List.Item.Meta
                      description={
                        <div>
                          <p><strong>หัวข้อรายงาน:</strong> {report.reason}</p>
                          <p><strong>รายระเอียดการรายงาน:</strong> {report.details || "No additional details"}</p>
                          <p><strong>สถานะ:</strong> {report.status}</p>
                          <p><strong>รายงานโดย:</strong> {report.user.firstName} {report.user.lastName}</p>
                          <p><strong>สินค้า:</strong> {report.product.name}</p>
                        </div>
                      }
                    />
                    <Button
                      
                      danger
                      onClick={() => handleDeleteProduct(report.product.id)}
                    >
                      ลบโพสต์
                    </Button>
                  </List.Item>
                )}
              />
            ) : (
              <p>ไม่เจอการรายงาน</p>
            )}
          </div>
        )}
        {currentSection === "banList" && (
          <div >
            <ReportUser />
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
