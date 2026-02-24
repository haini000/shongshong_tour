import { NavLink } from "react-router-dom";
import "./footer.scss";

const Navigation = () => {
  return (
    <nav className="bottom-nav">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>홈</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>탐색</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>장바구니</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;