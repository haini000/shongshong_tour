/*
* Page: NewPage
* 담당자: 김두현
* 역할: 관리자 상품 수정 및 UI 구현
* 생성일: 2026-02-19
* 최종 수정일: 2026-03-01
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import CategorySelector, { type Category } from "../../../components/admin/category/CategorySelector";
import "./Edit.scss";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minTravelDate = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [newImage, setNewImage] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

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
        setImageUrl(data.product_image);
      }

      if (error) {
        console.error(error);
      }

      const { data: mapData } = await supabase
        .from("Product_Map")
        .select("category_id")
        .eq("product_number", Number(id));

      if (mapData) {
        setSelectedCategories(mapData.map(item => item.category_id));
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("Category")
        .select("category_id, category_name");

      if (data) setCategories(data);
      if (error) console.error(error);
    };

    fetchCategories();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    if (!id) return;

    e.preventDefault();

    if (!date) {
      alert("출발일을 선택해주세요.");
      return;
    }

    if (date < minTravelDate) {
      alert("출발일은 내일부터 선택 가능합니다.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("카테고리를 1개 이상 선택해주세요.");
      return;
    }

    let finalImageUrl = imageUrl;

    if (newImage) {
      const fileName = `${Date.now()}-${newImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, newImage);

      if (uploadError) {
        alert("이미지 업로드 실패");
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      finalImageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("Product")
      .update({
        product_name: name,
        product_price: price,
        product_desc: desc,
        product_stock: stock,
        travel_date: date,
        product_image: finalImageUrl,
      })
      .eq("product_number", Number(id))

    if (error) {
      alert("수정 실패");
      return;
    }

    await supabase
      .from("Product_Map")
      .delete()
      .eq("product_number", Number(id));

    const newMap = selectedCategories.map((catId) => ({
      product_number: Number(id),
      category_id: catId,
    }));

    if (newMap.length > 0) {
      await supabase
        .from("Product_Map")
        .insert(newMap);
    }

    alert("수정 완료");
    navigate("/admin/products");
  }


  return (
    <div className="product-edit">
      <div className="edit-container">
        <h1>상품 정보 수정</h1>
        <p>등록된 기존 정보를 확인하고 수정해주세요.</p>

        <form onSubmit={handleUpdate}>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="현재 이미지"
              className="edit-preview"
            />
          )}

          <div className="image-edit-box">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setNewImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview && (
              <img
                src={preview}
                alt="새 이미지 미리보기"
                className="edit-preview"
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">상품명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <CategorySelector
            categories={categories}
            setCategories={setCategories}
            selectedCategoryIds={selectedCategories}
            setSelectedCategoryIds={setSelectedCategories}
            label="카테고리"
          />

          <div className="row">
            <div className="form-group">
              <label htmlFor="price">판매 가격</label>
              <input
                id="price"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">기간</label>
              <input
                id="date"
                type="date"
                min={minTravelDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">상품 요약 설명</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">재고 수량</label>
            <input
              id="stock"
              type="number"
              min="1"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              취소
            </button>

            <button type="submit" className="submit-btn">
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
