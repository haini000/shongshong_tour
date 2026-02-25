import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("Product").select("*");
      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  return (
    <div>
      <h2>상품 관리</h2>

      <button onClick={() => navigate("/admin/products/new")}>
        + 상품 등록
      </button>

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
                <p className="description">
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
    </div>
  );
};

export default List;
