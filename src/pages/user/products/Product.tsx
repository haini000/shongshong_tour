import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

interface Product {
  product_number: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  product_stock: number;
  travel_date: string;
}

const Products = () => {
  const { productNumber } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!productNumber) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("Product")
        .select("*")
        .eq("product_number", Number(productNumber)) // 숫자 변환
        .single();

      if (error) {
        console.error(error);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [productNumber]);

  if (!product) return <div>로딩중...</div>;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("로그인 후 이용해주세요.");
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("Cart").insert([
        {
          user_id: user.id,
          product_number: product.product_number,
          people_number: 1,
        },
      ]);

      if (error) throw error;

      alert("장바구니에 담았습니다.");
      navigate("/cart");
    } catch (err: any) {
      console.error("Cart insert error:", err);
      alert(err?.message ?? "장바구니 담기에 실패했습니다.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="main-content">
      <h1>{product.product_name}</h1>
      <p>{product.product_price}원</p>
      <p>{product.product_desc}</p>
      <p>출발일: {product.travel_date}</p>
      <p>정원: {product.product_stock}명</p>

      <button onClick={handleAddToCart} disabled={adding}>
        {adding ? "담는 중..." : "장바구니 담기"}
      </button>
    </div>
  );
};

export default Products;