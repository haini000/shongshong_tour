import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Helmet } from "react-helmet-async";
import "./Main.scss";

interface Product {
  product_number: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  product_stock: number;
  travel_date: string;
  product_image: string | null;
  product_description?: string | null;
}

interface Category {
  category_id: number;
  category_name: string;
}

const Main = () => {
  const navigate = useNavigate();

  // 임시 데이터 (나중에 Supabase 연결)
  const categories = [
    { id: 1, name: "항공", icon: "✈️" },
    { id: 2, name: "숙소", icon: "🏨" },
    { id: 3, name: "투어", icon: "🚌" },
    { id: 4, name: "패키지", icon: "🧳" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [adminCategories, setAdminCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const truncateText = (text: string, max = 50) =>
    text.length > max ? `${text.slice(0, max)}...` : text;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
      .from("Product")
      .select("*");

      if (error) {
        console.error("에러:", error);
      } else {
        setProducts(data || []);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("Category")
        .select("category_id, category_name");

      if (error) {
        console.error("카테고리 조회 에러:", error);
      } else {
        setAdminCategories(data || []);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>메인</title>
        <meta name="description" content="슝슝투어 메인" />
      </Helmet>
      <div className="main-content">
        {/* 1. Hero Banner */}
        <section className="hero-banner">
          <div className="banner-text">
            <p>꿈꾸던 국내 여행을</p>
            <h2>지금 슝슝투어와 함께</h2>
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
        <section className="search-section">
          <div className="search-bar">
            <div className="text">
              <h4>어디로 떠나시나요?</h4>
              <p>한국 인기 여행지를 지금 검색해보세요</p>
            </div>
            <button className="search-btn">🔍</button>
          </div>
        </section>

        {/* 4. Search Bar */}
        <section className="filter-section">
          <div className="filter-group">
            {adminCategories.length === 0 ? (
              <p className="filter-empty">등록된 카테고리가 없습니다.</p>
            ) : (
              adminCategories.map((category) => (
                <button
                  key={category.category_id}
                  className={`filter-chip ${selectedCategoryId === category.category_id ? "active" : ""}`}
                  onClick={() =>
                    setSelectedCategoryId((prev) =>
                      prev === category.category_id ? null : category.category_id
                    )
                  }
                >
                  {category.category_name}
                </button>
              ))
            )}
          </div>
        </section>
        {/* 5. Product List */}
        <section className="product-section">
          <div className="section-header">
            <h3>인기 여행 패키지</h3>
            <span className="view-all">전체보기</span>
          </div>

          <div className="card-list">
            {products.map((product) => (
              <div key={product.product_number} className="product-card">
                <div className="card-image">
                  <img
                    src={product.product_image || "/default.jpg"}
                    alt={product.product_name}
                    className="product-image"
                  />
                </div>

                <div className="card-info">
                  <div className="title-row">
                    <div className="title-text">
                      <h4>{product.product_name}</h4>
                      <p className="description">
                        {truncateText(
                          product.product_desc?.trim() ||
                          product.product_description?.trim() ||
                          "상품 설명이 없습니다."
                        )}
                      </p>
                    </div>
                    <span className="price">
                      {product.product_price.toLocaleString()}원
                    </span>
                  </div>

                  <p className="status">
                    {product.product_stock > 0 ? "🟢 예약 가능" : "🔴 마감"}
                    <span>정원: {product.product_stock}명</span>
                  </p>

                  <div className="footer-row">
                    <span>출발일: {product.travel_date}</span>
                    <button
                      className="detail-btn"
                      onClick={() => 
                        navigate(`/product/${product.product_number}`)
                      }
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="more-btn">인기 상품 더보기</button>
        </section>

        {/* Top Floating Button */}
        <button className="top-btn" onClick={() => window.scrollTo(0, 0)}>↑</button>
      </div>
    </>
  );
};

export default Main;