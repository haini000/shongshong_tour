import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">관리자 페이지</h1>

      <div className="admin-menu">
        <div className="admin-card" onClick={() => navigate("/admin/products")}>
          <img src="/icons/product.png" alt="상품 관리" className="admin-icon" />
          <span className="admin-label">상품 관리</span>
        </div>

        <div className="admin-card">
          <img src="/icons/users.png" alt="회원 관리" className="admin-icon" />
          <span className="admin-label">회원 관리</span>
        </div>

        <div className="admin-card">
          <img src="/icons/notice.png" alt="공지 관리" className="admin-icon" />
          <span className="admin-label">공지 관리</span>
        </div>

        <div className="admin-card">
          <img src="/icons/coupon.png" alt="쿠폰 관리" className="admin-icon" />
          <span className="admin-label">쿠폰 관리</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;