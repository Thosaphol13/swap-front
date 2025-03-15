// src/components/ReportUserModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createReportUser } from '../api/api';

const ReportUserModal = ({ show, handleClose }) => {
  const [reportingUserId, setReportingUserId] = useState('');
  const [reportedUserId, setReportedUserId] = useState('');
  const [reason, setReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      reportingUserId,
      reportedUserId,
      reason,
      additionalInfo,
    };

    try {
      const response = await createReportUser(reportData);
      alert('Report created successfully');
      console.log(response);
      handleClose(); // ปิด Modal หลังจากส่งข้อมูลสำเร็จ
    } catch (error) {
      alert('Failed to create report');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Report User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reportingUserId">
            <Form.Label>Reporting User ID</Form.Label>
            <Form.Control
              type="text"
              value={reportingUserId}
              onChange={(e) => setReportingUserId(e.target.value)}
              placeholder="Enter Reporting User ID"
              required
            />
          </Form.Group>

          <Form.Group controlId="reportedUserId">
            <Form.Label>Reported User ID</Form.Label>
            <Form.Control
              type="text"
              value={reportedUserId}
              onChange={(e) => setReportedUserId(e.target.value)}
              placeholder="Enter Reported User ID"
              required
            />
          </Form.Group>

          <Form.Group controlId="reason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter Reason"
              required
            />
          </Form.Group>

          <Form.Group controlId="additionalInfo">
            <Form.Label>Additional Info</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter Additional Information"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Report
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReportUserModal;
