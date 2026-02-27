import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./Header.scss";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      alert("로그아웃에 실패했습니다.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <header className="admin_header">
      <h1 className="logo-tt" onClick={() => navigate("/")}>Shong Shong Tour</h1>
      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
        aria-label="로그아웃"
        title="로그아웃"
      >
        <span className="material-icons">logout</span>
      </button>
    </header>
  );
};

export default Header;
