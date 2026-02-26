/*
* Page: ListPage
* 담당자: 김두현
* 역할: 관리자 상품 목록 및 UI 구현
* 생성일: 2026-02-20
* 최종 수정일: 2026-03-01
*/

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "../../../components/common.scss";
import "./List.scss";

interface Product {
  product_number: number;
  product_name: string;
  product_price: number;
  product_image: string | null;
  product_desc?: string | null;
  product_description?: string | null;
}

const List = () => {
  const ITEMS_PER_PAGE = 20;
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("Product").select("*");
      const sorted = (data || []).sort(
        (a, b) => b.product_number - a.product_number
      );
      setProducts(sorted);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const description = product.product_desc || product.product_description || "";
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return true;

    return (
      product.product_name.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTopBtn(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages] as const;
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    }

    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages] as const;
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("Product")
      .delete()
      .eq("product_number", id);

    if (error) {
      alert("삭제 실패");
      console.error(error);
      return;
    }

    alert("삭제 완료");
    setProducts((prev) =>
      prev.filter((product) => product.product_number !== id)
    );
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-product-page">
      <div className="list-top">
        <div className="list-title-group">
          <button
            type="button"
            className="list-back-btn"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
          >
            <span className="material-icons">chevron_left</span>
          </button>

          <div>
            <h2 className="admin-tt">상품 관리</h2>
            <p className="list-count admin-list-desc">
              총 <strong>{filteredProducts.length}</strong>개의 여행 상품
            </p>
          </div>
        </div>

        <button
          type="button"
          className="list-add-btn"
          onClick={() => navigate("/admin/products/new")}
        >
          상품 추가 <span className="material-icons">add</span>
        </button>
      </div>

      <label className="list-search">
        <span className="material-icons">search</span>
        <input
          type="text"
          className="admin-desc"
          placeholder="상품 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </label>

      <div className="admin-product-list">
        {paginatedProducts.map((product) => (
          <div
            key={product.product_number}
            className="admin-product-card"
          >
            <img
              src={product.product_image || "/default.jpg"}
              alt={product.product_name}
              className="product-image"
            />

            <div className="card-content">
              <div className="card-texts">
                <h3>{product.product_name}</h3>
                <p className="description admin-desc">
                  {product.product_desc?.trim() ||
                    product.product_description?.trim() ||
                    "상품 설명이 없습니다."}
                </p>
              </div>

              <div className="card-actions">
                <button
                  className="action-btn"
                  onClick={() =>
                    navigate(`/admin/products/${product.product_number}/edit`)}
                  aria-label="상품 편집"
                >
                  <span className="material-icons">edit</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(product.product_number)}
                  aria-label="상품 삭제"
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-wrap">
        <div className="pagination">
          {currentPage > 1 ? (
            <button
              className="page-arrow"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              aria-label="previous page"
            >
              <span className="material-icons">chevron_left</span>
            </button>
          ) : (
            <span className="page-arrow page-arrow-placeholder" aria-hidden="true" />
          )}

          {getVisiblePages().map((page, idx) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          {currentPage < totalPages ? (
            <button
              className="page-arrow"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              aria-label="next page"
            >
              <span className="material-icons">chevron_right</span>
            </button>
          ) : (
            <span className="page-arrow page-arrow-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>

      {showScrollTopBtn && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={handleScrollTop}
          aria-label="맨 위로 이동"
        >
          <span className="material-icons">expand_less</span>
        </button>
      )}
    </div>
  );
};

export default List;
