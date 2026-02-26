/*
* Page: NewPage
* 담당자: 김두현
* 역할: 관리자 상품 등록 및 UI 구현
* 생성일: 2026-02-19
* 최종 수정일: 2026-03-01
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import CategorySelector, { type Category } from "../../../components/admin/category/CategorySelector";
import "../../../components/common.scss";
import "./New.scss";

const API_BASE = "/api/v1";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const New = () => {
  const navigate = useNavigate();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minTravelDate = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    date: "",
    desc: "",
    stock: "",
    image: "",
  });

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("Category")
      .select("category_id, category_name");

    if (error) {
      console.error(error);
      return;
    }

    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validate = () => {
    const newErrors = {
      name: "",
      price: "",
      date: "",
      desc: "",
      stock: "",
      image: "",
    };

    if (!image) {
      newErrors.image = "상품 이미지를 첨부해주세요.";
    }

    if (!name.trim()) {
      newErrors.name = "상품명을 입력해주세요.";
    }

    if (!price || price <= 0) {
      newErrors.price = "가격은 0원보다 커야 합니다.";
    }

    if (!date) {
      newErrors.date = "출발일을 선택해주세요.";
    } else if (date < minTravelDate) {
      newErrors.date = "출발일은 내일부터 선택 가능합니다.";
    }

    if (!desc.trim()) {
      newErrors.desc = "상품 설명을 입력해주세요.";
    }

    if (!stock || stock <= 0) {
      newErrors.stock = "재고는 1개 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let imageUrl = "";

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error(uploadError);
        alert("이미지 업로드 실패");
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { data: productData, error } = await supabase
      .from("Product")
      .insert([
        {
          product_name: name,
          product_price: price,
          product_desc: desc,
          product_stock: stock,
          travel_date: date,
          product_image: imageUrl,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert("등록 실패");
      return;
    }

    if (!productData || productData.length === 0) {
      alert("상품 생성 실패");
      return;
    }

    const productNumber = productData[0].product_number;

    if (selectedCategoryIds.length === 0) {
      alert("카테고리를 1개 이상 선택해주세요.");
      return;
    }

    const productMapRows = selectedCategoryIds.map((id) => ({
      product_number: productNumber,
      category_id: id,
    }));

    const { error: mapError } = await supabase
      .from("Product_Map")
      .insert(productMapRows);

    if (mapError) {
      console.error(mapError);
      alert("카테고리 연결 실패");
      return;
    }

    alert("등록 완료");
    navigate("/admin/products");
  };

  const handleGenerateDesc = async () => {
    setAiError("");

    if (!name.trim()) {
      setAiError("상품명을 먼저 입력해주세요.");
      return;
    }

    if (!price || price <= 0) {
      setAiError("가격을 먼저 입력해주세요.");
      return;
    }

    if (!date) {
      setAiError("날짜를 먼저 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    const prompt = `
      여행 상품 정보를 기반으로 매력적인 상품 설명을 작성해주세요.
      - 상품명: ${name}
      - 가격: ${price}
      - 여행기간: ${date}
      - 300자 이내
      - 고객이 예약하고 싶도록 작성
      - 출처, 링크, 참고문헌은 포함하지 말 것
      - 상품명, 가격, 출발일 앞 뒤로 ** 표시 하지 말 것
      `;

    try {
      const response = await fetch(
        `${API_BASE}/question?content=${encodeURIComponent(prompt)}&client_id=${CLIENT_ID}`
      );

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();

      setDesc(data.content);

    } catch (error) {
      console.error(error);
      setAiError("AI 설명 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="product-create">
      <div className="page-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <span className="material-icons">chevron_left</span>
        </button>

        <div>
          <h1 className="title admin-tt">새로운 여행 상품 등록</h1>
          <p className="subtitle admin-list-desc">
            관리자님, 숑숑투어의 새로운 모델을 추가해주세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="admin-sub">대표 이미지</label>
        <div className="form-group image-group image-upload-box">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview ? (
            <img src={preview} className="image-preview" alt="미리보기" />
          ) : (
            <div className="image-placeholder">
              <span className="material-icons">add_a_photo</span>
              <p className="admin-product">이미지 업로드</p>
              <small className="admin-iamge">PNG, JPG (최대 10MB)</small>
            </div>
          )}
        </div>
        {errors.image && <p className="error">{errors.image}</p>}

        <div className="form-group">
          <label className="admin-sub">상품명</label>
          <input
            type="text"
            className="admin-desc"
            placeholder="예: 제주도 3박 4일 힐링 패키지"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <CategorySelector
          categories={categories}
          setCategories={setCategories}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
        />

        <div className="row">
          <div className="form-group">
            <label className="admin-sub">상품 가격 (원)</label>
            <input
              type="number"
              min="1"
              className="admin-desc"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>

          <div className="form-group">
            <label className="admin-sub">출발일</label>
            <input
              type="date"
              min={minTravelDate}
              className="admin-desc"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="error">{errors.date}</p>}
          </div>
        </div>

        <div className="form-group">
          <div className="desc-label">
            <label className="admin-sub" htmlFor="product-desc">상세 설명</label>
            <button
              type="button"
              className="ai-badge admin-desc"
              onClick={(e) => {
                e.stopPropagation();
                void handleGenerateDesc();
              }}
              disabled={isGenerating}
              aria-label="AI로 설명 생성"
            >
              {isGenerating ? "AI…" : "AI"}
            </button>
          </div>

          <textarea
            id="product-desc"
            value={desc}
            className="admin-desc"
            placeholder="여행 상품에 대한 매력적인 설명을 작성해 주세요."
            onChange={(e) => setDesc(e.target.value)}
          />

          {aiError && <p className="error">{aiError}</p>}
          {errors.desc && <p className="error">{errors.desc}</p>}
        </div>


        <div className="form-group">
          <label>정원</label>
          <input
            type="number"
            min="1"
            className="admin-desc"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          {errors.stock && <p className="error">{errors.stock}</p>}
        </div>

        <button type="submit" className="submit-btn">
          상품 등록 완료하기 <span className="material-icons">add_circle</span>
        </button>
      </form>
    </div>
  );
};

export default New;

