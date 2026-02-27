import { useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="admin_header">
      <h1 className="logo-tt" onClick={() => navigate("/")}>Shong Shong Tour</h1>
      <button>로그아웃</button>
    </header>
  );
};

export default Header;
