import React, { useState, useEffect } from 'react';
import { List, Button, Modal } from 'antd';
import { getReportedUsers, changeUserStatus } from '../api/adminApi';
import '../css/ReportUser.css';

const ReportUser = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchReportedUsers = async () => {
      try {
        const data = await getReportedUsers();
        setReportedUsers(data);
      } catch (error) {
        setError("Failed to fetch reported users.");
      }
    };

    fetchReportedUsers();
  }, []);

  const handleStatusChange = async (userId, status) => {
    const action = status === 'off' ? 'แบน' : 'ปลดแบน';
    const confirmMessage = `คุณแน่ใจหรือไม่ว่าต้องการ${action}ผู้ใช้นี้?`;

    Modal.confirm({
      title: confirmMessage,
      onOk: async () => {
        try {
          await changeUserStatus(userId, status);
          setSuccess(`รายงานผู้ใช้ ${status === 'off' ? 'สําเร็จ' : 'ปลดแบนสำเสร็จ'}.`);
          setReportedUsers(prevUsers =>
            prevUsers.map(user =>
              user.reportedUser.id === userId ? { ...user, reportedUser: { ...user.reportedUser, status } } : user
            )
          );
        } catch (error) {
          setError("Failed to change user status.");
        }
      },
    });
  };

  return (
    <div className="report-section">
      <h2 className="report-title">รายงานผู้ใช้</h2>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
      {reportedUsers.length > 0 ? (
        <div className="report-list">
          {reportedUsers.map((report) => {
            const user = report.reportedUser; // ใช้ข้อมูลของ reportedUser
            return (
              <div key={user.id} className="report-item">
                <div className="report-header">
                  <h3>{`${user.firstName} ${user.lastName}`}</h3>
                  <p className="status">
                    สถานะ: {user.status === "off" ? "Banned" : "Active"}
                  </p>
                </div>
                <p className="report-info">
                  รายงานโดย: {report.reportingUser.firstName}{" "}
                  {report.reportingUser.lastName}
                </p>
                <p className="report-reason">
                  เหตุผล: {report.reason || "ไม่มีเหตุผลที่ระบุ"}
                </p>
                <p className="report-details">
                  ข้อมูลเพิ่มเติม: {report.additionalInfo || "ไม่มีข้อมูลเพิ่มเติม"}
                </p>
                <button
                  className={`report-action ${
                    user.status === "off" ? "unban-btn" : "ban-btn"
                  }`}
                  onClick={() =>
                    handleStatusChange(user.id, user.status === "off" ? "on" : "off")
                  }
                >
                  {user.status === "off" ? "Unban" : "Ban"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-reports">No reported users found.</p>
      )}
    </div>
  );
};  

export default ReportUser;
