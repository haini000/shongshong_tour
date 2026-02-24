import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./List.scss"

interface Product {
  product_number: number;
  product_name: string;
  product_price: number;
  product_image: string | null;
}

const List = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("Product")
        .select("*");

      setProducts(data || []);
    };

    fetchProducts();
  }, []);

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
    } else {
      alert("삭제 완료");

      setProducts((prev) =>
        prev.filter((product) => product.product_number !== id)
      );
    }
  };

  return (
    <div>
      <h2>상품 관리</h2>

      <button onClick={() => navigate("/admin/products/new")}>
        + 상품 등록
      </button>
      <div className="admin-product-list">
        {products.map((product) => (
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
              <h3>{product.product_name}</h3>
              <p className="price">
                {product.product_price.toLocaleString()}원
              </p>

              <div className="card-actions">
                <button
                  onClick={() =>
                    navigate(`/admin/products/${product.product_number}/edit`)
                  }>✏️</button>
                <button
                  onClick={() => handleDelete(product.product_number)
                  }>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;