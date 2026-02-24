import { NavLink } from "react-router-dom";
import "./Footer.scss"

const Footer = () => {
  return (
    <nav className="admin_bottom">
      <NavLink to="/admin" end>
        <span className="material-icons">dashboard</span>
        <p>대시보드</p>
      </NavLink>

      <NavLink to="/admin/products">
        <span className="material-icons">inventory_2</span>
        <p>상품관리</p>
      </NavLink>

      <NavLink to="/admin/customer">
        <span className="material-icons">group</span>
        <p>회원관리</p>
      </NavLink>

      <NavLink to="/admin/notification">
        <span className="material-icons">campaign</span>
        <p>공지관리</p>
      </NavLink>

      <NavLink to="/admin/coupon">
        <span className="material-icons">local_activity</span>
        <p>쿠폰관리</p>
      </NavLink>
    </nav>
  );
};

export default Footer;