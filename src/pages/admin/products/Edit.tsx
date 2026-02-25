import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./Edit.scss";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [date, setDate] = useState("");

  const [categories, setCategories] = useState<any[]>([]);

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
        .select("*");

      if (data) setCategories(data);
      if (error) console.error(error);
    };

    fetchCategories();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    if (!id) return;

    e.preventDefault();

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

          <div className="form-group">
            <label className="form-title">카테고리</label>

            <div className="category-box">
              {categories.map((cat) => (
                <label
                  key={cat.category_id}
                  className={`category-item ${selectedCategories.includes(cat.category_id) ? "active" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    value={cat.category_id}
                    checked={selectedCategories.includes(cat.category_id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);

                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, id]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== id)
                        );
                      }
                    }}
                  />
                  {cat.category_name}
                </label>
              ))}
            </div>
          </div>

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
