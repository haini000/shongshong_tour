import { useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="admin_header">
      <h1 className="logo-tt" onClick={() => navigate("/admin")}>Shong Shong Tour</h1>
    </header>
  );
};

export default Header;
