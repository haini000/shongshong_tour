import { useNavigate } from "react-router-dom";
import "./Header.scss";

interface HeaderProps {
  cartCount: number;
}

const Header = ({ cartCount }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="common-header">
      <div className="header-inner">
        <h1 className="logo" onClick={() => navigate("/")}>
          Shong Shong Tour
        </h1>
        
        <div className="header-menu">
          <div className="cart-icon-wrapper" onClick={() => navigate("/cart")} style={{ cursor: 'pointer', position: 'relative', marginRight: '20px' }}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              width="24"
              height="24"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px'
              }}>
                {cartCount}
              </span>
            )}
          </div>

          <div className="user-icon" onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              width="24"
              height="24"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;