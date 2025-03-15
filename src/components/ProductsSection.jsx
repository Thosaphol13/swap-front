import React from 'react';
import { Card, Dropdown, Menu, Button, Avatar, Input, Modal, Tag, Carousel } from 'antd';
import { EllipsisOutlined, CommentOutlined, SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProductForm from './ProductForm';
import OfferForm from './OfferForm';
import OffersDetail from './OfferDetails';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../css/ProductsSection.css';

const { confirm } = Modal;

const ProductsSection = ({ 
  user, 
  filteredProducts, 
  showProductForm, 
  toggleProductForm, 
  handleReportProduct, 
  handleDeleteProduct, 
  handleExchangeClick, 
  selectedProduct, 
  showOfferForm, 
  handleCloseOfferForm, 
  showOffersDetail, 
  handleCloseOffersDetail, 
  dropdownProductId, 
  setDropdownProductId,
  searchProduct,
  handleProductClick,
  handleProfileClick,

}) => {
  
  const handleDeleteConfirm = (productId) => {
    confirm({
      title: 'คุณต้องการลบโพสต์นี้หรือไม่?',
      icon: <ExclamationCircleOutlined />,
      content: 'การลบโพสต์ไม่สามารถเลียกคืนได้',
      okText: 'ยืนยัน',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        handleDeleteProduct(productId);
      },
    });
  };

  console.log('filteredProducts:', filteredProducts);

  const renderDropdownMenu = (product) => (
    <Menu>
      {user.id !== product.user.id && (
        <Menu.Item onClick={() => handleReportProduct(product.id)}>รายงานโพสต์</Menu.Item>
      )}    
      {user.id === product.user.id && (
        <Menu.Item onClick={() => handleDeleteConfirm(product.id)}>ลบโพสต์</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="products-section">
      {showProductForm && <ProductForm userId={user.id} onClose={toggleProductForm} />}

      <div className="post-area">
        <div className="post-input">
          <Avatar src={user.profilePicture || '/default-profile.png'} size="large" />
          <Input
            onClick={toggleProductForm}
            placeholder={`ต้องการโพสต์สินค้าไหม, ${user.firstName}?`}
            readOnly
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        </div>
      </div>

      {filteredProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงลำดับจากใหม่ไปเก่า
        .map((product) => {
          // แปลง product.image ให้เป็น array (รองรับทั้ง string และ JSON string)
          let images = [];
          try {
            images = Array.isArray(product.image) ? product.image : JSON.parse(product.image || '[]');
          } catch (error) {
            console.error('Invalid image format:', product.image);
          }

          return (
            <Card
              key={product.id}
              hoverable
              style={{ margin: '16px 0' }}
              cover={
                <div >
                  <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', margin: '5px' }}>
                    {product.name}
                  </div>
                  {/* แสดง Carousel ถ้ามีมากกว่า 1 รูป */}
                  {images.length > 1 ? (
                    <Carousel
                    autoplay={false}  // ปิด autoplay เพื่อให้เลื่อนเองได้
                    dots={false}  // ปิดจุดเลือกภาพ
                    arrows={true}  // เพิ่มปุ่มลูกศรเลื่อน
                    prevArrow={<button className="custom-arrow custom-left" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}><LeftOutlined style={{ color: 'black' }} /></button>}
                    nextArrow={<button className="custom-arrow custom-right" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}><RightOutlined style={{ color: 'black' }} /></button>}
                    adaptiveHeight={true}  // ปรับขนาดอัตโนมัติ
                  >
                    {images.map((img, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <img
                          src={img}
                          alt={`${product.name}-${index}`}
                          onClick={() => handleProductClick(product.id)}
                          style={{
                            cursor: 'pointer',
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '5px',
                            display: 'block',
                            margin: 'auto',
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                  
                  ) : (
                    <img
                      src={product.image || '/default-product.png'}
                      alt={product.name}
                      onClick={() => handleProductClick(product.id)}
                      style={{
                        cursor: 'pointer',
                            width: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'contain',
                            borderRadius: '5px',
                            display: 'block',
                            margin: 'auto',
                      }}
                    />
                  )}
                </div>
              }
              actions={[
                <Button icon={<CommentOutlined />} onClick={() => handleProductClick(product.id)} type="link">
                  คอมเมนต์
                </Button>,
                user.id !== product.user.id ? (
                  <Button
                    icon={<SwapOutlined />}
                    onClick={() => handleExchangeClick(product)}
                    type="link"
                    disabled={product.status !== 'available'}
                  >
                    เสนอแลก
                  </Button>
                ) : (
                  <Button
                    icon={<SwapOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      alert('ไม่สามารถแลกกับสินค้าตัวเองได้!');
                    }}
                    type="link"
                    disabled
                  >
                    แลกเปลี่ยน
                  </Button>
                ),
              ]}
              extra={
                <Dropdown overlay={renderDropdownMenu(product)} trigger={['click']}>
                  <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown>
              }
            >
              <Card.Meta
                avatar={
                  <Avatar
                    src={product.user?.profilePicture || '/default-profile.png'}
                    onClick={() => handleProfileClick(product.user.id)}
                    style={{ cursor: 'pointer' }}
                  />
                }
                title={product.user.nickname}
                description={
                  <>
                    <div>{new Date(product.createdAt).toLocaleString()}</div>
                    <div>
                      <Tag color={product.status === 'available' ? 'green' : 'red'}>
                        {product.status === 'available' ? 'พร้อมแลก' : 'แลกแล้ว'}
                      </Tag>
                    </div>
                    <div>ราคาประเมิน: {product.price} บาท</div>
                    <div>ประเภทสินค้าที่ต้องการแลก: {product.categoryWantId ? product.categoryWantId.name : "ไม่มีหมวดหมู่"}</div>
 
                  </>
                }
              />
            </Card>
          );
        })}

      {showOfferForm && selectedProduct && (
        <OfferForm productId={selectedProduct.id} fromUserId={user.id} toUserId={selectedProduct.user.id} onClose={handleCloseOfferForm} />
      )}

      {showOffersDetail && (
        <OffersDetail userId={user.id} productId={user.productId} onClose={handleCloseOffersDetail} />
      )}
    </div>
  );
};


export default ProductsSection;
