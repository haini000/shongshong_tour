import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./New.scss";

const New = () => {
  const navigate = useNavigate();

  type Category = {
    category_id: number;
    category_name: string;
  };

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
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

    fetchCategories();
  }, []);

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    date: "",
    desc: "",
    stock: ""
  });

  const validate = () => {
    const newErrors = {
      name: "",
      price: "",
      date: "",
      desc: "",
      stock: ""
    };

    if (!name.trim()) {
      newErrors.name = "상품명을 입력해주세요.";
    }

    if (!price || price <= 0) {
      newErrors.price = "가격은 0원보다 커야 합니다.";
    }

    if (!date) {
      newErrors.date = "여행 날짜를 선택해주세요.";
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
    const productNumber = productData[0].product_id;

    if (!categoryId) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const { error: mapError } = await supabase
      .from("Product_Map")
      .insert([
        {
          product_id: productNumber,
          category_id: categoryId,
        },
      ]);

    if (mapError) {
      console.error(mapError);
      alert("카테고리 연결 실패");
      return;
    }

    alert("등록 완료");
    navigate("/admin/products");
  }

  return (
    <div className="product-create">
      <div className="page-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <div>
          <h1 className="title">새로운 여행 상품 등록</h1>
          <p className="subtitle">
            관리자님, 숑숑투어의 새로운 모델을 추가해주세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 대표 이미지 */}
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
            <img src={preview} className="image-preview" />
          ) : (
            <div className="image-placeholder">
              📷
              <p>이미지 업로드</p>
              <small>PNG, JPG (최대 10MB)</small>
            </div>
          )}
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
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* 카테고리 */}
        <div className="form-group">
          <label>카테고리</label>

          <div className="category-group">
            {categories.map((item) => (
              <button
                type="button"
                key={item.category_id}
                className={
                  categoryId === item.category_id ? "active" : ""
                }
                onClick={() => setCategoryId(item.category_id)}
              >
                {item.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* 가격 + 기간 */}
        <div className="row">
          <div className="form-group">
            <label>상품 가격 (원)</label>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors.price && <p className="error">{errors.price}</p>}
          </div>

          <div className="form-group">
            <label>여행 기간</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="error">{errors.date}</p>}
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="form-group">
          <label>상세 설명</label>
          <textarea
            value={desc}
            placeholder="여행 상품에 대한 매력적인 설명을 작성해 주세요."
            onChange={(e) => setDesc(e.target.value)}
          />
          {errors.desc && <p className="error">{errors.desc}</p>}
        </div>

        {/* 재고 */}
        <div className="form-group">
          <label>재고 수량</label>
          <input
            type="number"
            min="1"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          {errors.stock && <p className="error">{errors.stock}</p>}
        </div>

        <button type="submit" className="submit-btn">
          상품 등록 완료하기 +
        </button>
      </form>
    </div>
  );
};

export default New;