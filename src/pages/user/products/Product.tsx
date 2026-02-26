import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  return (
    <div className="main-content">
      <h1>{product.product_name}</h1>
      <p>{product.product_price}원</p>
      <p>{product.product_desc}</p>
      <p>출발일: {product.travel_date}</p>
      <p>정원: {product.product_stock}명</p>
    </div>
  );
};

export default Products;