import { useNavigate } from "react-router-dom";
import "./Main.scss";

const Main = () => {
  const navigate = useNavigate();

  // 임시 데이터 (나중에 Supabase 연결)
  const categories = [
    { id: 1, name: "항공", icon: "✈️" },
    { id: 2, name: "숙소", icon: "🏨" },
    { id: 3, name: "투어", icon: "🚌" },
    { id: 4, name: "패키지", icon: "🧳" },
  ];

  const filters = ["전체", "자연/힐링", "호캉스", "액티비티", "제주", "강원", "부산", "전라/경상", "수도권"];

  return (
    <div className="main-content">
      {/* 1. Hero Banner */}
      <section className="hero-banner">
        <div className="banner-text">
          <p>꿈꾸던 국내 여행을</p>
          <h2>지금 숑숑투어와 함께</h2>
        </div>
      </section>

      {/* 2. Category Menu */}
      <nav className="category-menu">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <div className="icon-box">{cat.icon}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </nav>

      {/* 3. Filter Tags */}
      <section className="filter-section">
        <div className="filter-group">
          {filters.map((tag, index) => (
            <button key={index} className={`filter-chip ${index === 0 ? 'active' : ''}`}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Search Bar */}
      <section className="search-section">
        <div className="search-bar">
          <div className="text">
            <h4>어디로 떠나시나요?</h4>
            <p>한국 인기 여행지를 지금 검색해보세요</p>
          </div>
          <button className="search-btn">🔍</button>
        </div>
      </section>

      {/* 5. Product List */}
      <section className="product-section">
        <div className="section-header">
          <h3>인기 여행 패키지</h3>
          <span className="view-all">전체보기</span>
        </div>

        {/* 상품 카드 (반복문으로 처리 가능) */}
        <div className="product-card">
          <div className="card-image">
            <img src="https://via.placeholder.com/340x200" alt="product" />
          </div>
          <div className="card-info">
            <div className="title-row">
              <h4>제주도 3박 4일 감성 숙소 패키지</h4>
              <span className="price">450,000원</span>
            </div>
            <p className="status">🟢 예약 가능</p>
            <div className="footer-row">
              <span className="rating">⭐ 4.9 (245)</span>
              <button className="detail-btn" onClick={() => navigate("/products/1")}>
                상세보기
              </button>
            </div>
          </div>
        </div>
        
        <button className="more-btn">인기 상품 더보기</button>
      </section>

      {/* Top Floating Button */}
      <button className="top-btn" onClick={() => window.scrollTo(0, 0)}>↑</button>
    </div>
  );
};

export default Main;