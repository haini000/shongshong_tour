import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");

  // 🔹 기존 데이터 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("Product")
        .select("*")
        .eq("product_number", Number(id))
        .single();

      if (data) {
        setName(data.product_name);
        setPrice(data.product_price);
        setDesc(data.product_desc);
        setStock(data.product_stock);
        setDate(data.travel_date);
      }

      if (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 수정 제출
  const handleUpdate = async (e: React.FormEvent) => {
    if (!id) return;

    e.preventDefault();

    const { error } = await supabase
      .from("Product")
      .update({
        product_name: name,
        product_price: price,
        product_desc: desc,
        product_stock: stock,
        travel_date: date,
      })
      .eq("product_number", Number(id))

    if (error) {
      alert("수정 실패");
    } else {
      alert("수정 완료");
      navigate("/admin/products");
    }
  };

  return (
    <div className="product-edit">
      <h1>상품 수정</h1>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default Edit;