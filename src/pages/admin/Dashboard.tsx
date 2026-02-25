import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">관리자 페이지</h1>

      <div className="admin-menu">
        <div className="admin-card admin-card-products" onClick={() => navigate("/admin/products")}>
          <p className="material-icons">inventory_2</p>
          <span className="admin-label">상품 관리</span>
        </div>

        <div className="admin-card admin-card-members">
          <p className="material-icons">group</p>
          <span className="admin-label">회원 관리</span>
        </div>

        <div className="admin-card admin-card-notice">
          <p className="material-icons">campaign</p>
          <span className="admin-label">공지 관리</span>
        </div>

        <div className="admin-card admin-card-coupon">
          <p className="material-icons">confirmation_number</p>
          <span className="admin-label">쿠폰 관리</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
