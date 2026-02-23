import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./New.scss";

const New = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("Product")
      .insert([
        {
          product_name: name,
          product_price: price,
          product_desc: desc,
          product_stock: stock,
          travel_date: date,
        },
      ]);

    if (error) {
      console.error(error);
      alert("등록 실패");
    } else {
      alert("등록 완료");
      navigate("/admin/products");
    }
  };

  return (
    <div className="product-create">
      <h1 className="title">새로운 여행 상품 등록</h1>
      <p className="subtitle">
        관리자님, 숑숑투어의 새로운 모델을 추가해주세요.
      </p>

      <form onSubmit={handleSubmit}>
        {/* 대표 이미지 */}
        <div className="form-group image-group">
          <label>대표 이미지</label>
          <div className="image-upload-box">
            <input type="file" />
            <span>이미지 업로드</span>
            <small>PNG, JPG (최대 10MB)</small>
          </div>
        </div>

        {/* 상품명 */}
        <div className="form-group">
          <label>상품명</label>
          <input
            type="text"
            placeholder="예: 제주도 3박 4일 힐링 패키지"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 가격 + 기간 */}
        <div className="row">
          <div className="form-group">
            <label>상품 가격 (원)</label>
            <input
              type="number"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>여행 기간</label>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            placeholder="여행 상품에 대한 매력적인 설명을 작성해 주세요."
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* 재고 */}
        <div className="form-group">
          <label>재고 수량</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="예: 30"
          />
        </div>

        <button type="submit" className="submit-btn">
          상품 등록 완료하기 +
        </button>
      </form>
    </div>
  );
};

export default New;