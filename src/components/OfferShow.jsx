import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Carousel } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const OfferShow = () => {
    const { offerId } = useParams();
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userId');
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // ใช้ navigate แทนที่จะเรียก Navigate โดยตรง
  };

    useEffect(() => {
        const fetchOffers = async () => {
          if (!offerId) {
            console.error('Offer ID is missing');
            return;
          }
          try {
            const response = await axios.get(`http://localhost:3001/offers/${offerId}`);
            setOffers(response.data);
          } catch (error) {
            console.error('Error fetching offers:', error);
          }
        };
        fetchOffers();
      }, [offerId]);
      

    return (
        <div className="product-detail-modal">
          <div className="modal-content">
            <Button type="text" onClick={handleClose} style={{ marginBottom: 16 }}>
              ย้อนกลับ
            </Button>
            <h2>{offers?.name}</h2>
            <Carousel autoplay={false}  // ปิด autoplay เพื่อให้เลื่อนเองได้
                    dots={false}  // ปิดจุดเลือกภาพ
                    arrows={true}  // เพิ่มปุ่มลูกศรเลื่อน
                    prevArrow={<button className="custom-arrow custom-left" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}><LeftOutlined style={{ color: 'black' }} /></button>}
                    nextArrow={<button className="custom-arrow custom-right" style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}><RightOutlined style={{ color: 'black' }} /></button>}
                    adaptiveHeight={true}
                    >
              {offers?.image?.length > 0 ? (
                offers.image.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${offers.name} - ${index + 1}`}
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
                ))
              ) : (
                <img
                  src="/default-product.png"
                  alt="Default Product"
                  className="product-detail-image"
                />
              )}
            </Carousel>
            <div className="product-detail-info">
              <p><span>รายละเอียดสินค้า:</span> {offers?.description}</p>
              <p><span>ราคาประเมิน:</span> {offers?.price}</p>
              
              {/* <p><span>โพสต์สินค้าโดย:</span> {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p> */}
            </div>
          </div>
        </div>
    
      );
}

export default OfferShow