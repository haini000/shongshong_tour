import { useNavigate } from "react-router-dom"; // Navigate 삭제
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="admin_header">
      <h1 onClick={() => navigate("/admin")}>Shong Shong Tour</h1>
    </header>
  );
};

export default Header;