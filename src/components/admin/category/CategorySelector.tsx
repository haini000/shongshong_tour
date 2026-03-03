import { type Dispatch, type SetStateAction, useState } from "react";
import "../../common.scss";
import { supabase } from "../../../lib/supabase";

export type Category = {
  category_id: number;
  category_name: string;
};

type CategorySelectorProps = {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: Dispatch<SetStateAction<number[]>>;
  label?: string;
};

const CategorySelector = ({
  categories,
  setCategories,
  selectedCategoryIds,
  setSelectedCategoryIds,
  label = "카테고리",
}: CategorySelectorProps) => {
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isCategoryEditMode, setIsCategoryEditMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("카테고리 이름을 입력해주세요.");
      return;
    }

    const duplicated = categories.some(
      (item) => item.category_name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicated) {
      setCategoryError("이미 존재하는 카테고리입니다.");
      return;
    }

    setCategoryError("");
    setIsAddingCategory(true);

    const { data, error } = await supabase
      .from("Category")
      .insert([{ category_name: trimmedName }])
      .select("category_id, category_name")
      .single();

    setIsAddingCategory(false);

    if (error || !data) {
      console.error(error);
      setCategoryError("카테고리 추가에 실패했습니다.");
      return;
    }

    setCategories((prev) => [...prev, data]);
    setSelectedCategoryIds((prev) =>
      prev.includes(data.category_id) ? prev : [...prev, data.category_id]
    );
    setNewCategoryName("");
    setIsCategoryFormOpen(false);
  };

  const handleStartEditCategory = (category: Category) => {
    setCategoryError("");
    setEditingCategoryId(category.category_id);
    setEditingCategoryName(category.category_name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setCategoryError("");
  };

  const handleSaveCategoryName = async () => {
    if (!editingCategoryId) return;

    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("카테고리 이름을 입력해주세요.");
      return;
    }

    const duplicated = categories.some(
      (item) =>
        item.category_id !== editingCategoryId &&
        item.category_name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicated) {
      setCategoryError("이미 존재하는 카테고리입니다.");
      return;
    }

    setCategoryError("");
    setIsUpdatingCategory(true);

    const { data, error } = await supabase
      .from("Category")
      .update({ category_name: trimmedName })
      .eq("category_id", editingCategoryId)
      .select("category_id, category_name")
      .single();

    setIsUpdatingCategory(false);

    if (error || !data) {
      console.error(error);
      setCategoryError("카테고리 수정에 실패했습니다.");
      return;
    }

    setCategories((prev) =>
      prev.map((item) =>
        item.category_id === editingCategoryId ? data : item
      )
    );
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  return (
    <div className="form-group">
      <div className="category-label-row">
        <label className="admin-sub">{label}</label>
        <div className="category-label-actions">
          <button
            type="button"
            className="category-add-toggle-btn admin-desc"
            onClick={() => {
              setIsCategoryFormOpen((prev) => !prev);
              setCategoryError("");
            }}
          >
            + 카테고리 추가
          </button>
          <button
            type="button"
            className="category-edit-toggle-btn admin-desc"
            onClick={() => {
              setIsCategoryEditMode((prev) => !prev);
              setEditingCategoryId(null);
              setEditingCategoryName("");
              setCategoryError("");
            }}
          >
            {isCategoryEditMode ? "수정 모드 종료" : "카테고리 수정"}
          </button>
        </div>
      </div>

      {isCategoryFormOpen && (
        <div className="category-create-row">
          <input
            type="text"
            className="admin-list-desc"
            placeholder="새 카테고리 이름"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            type="button"
            className="category-create-btn"
            onClick={handleAddCategory}
            disabled={isAddingCategory}
          >
            {isAddingCategory ? "추가 중..." : "추가"}
          </button>
          <button
            type="button"
            className="category-cancel-btn"
            onClick={() => {
              setIsCategoryFormOpen(false);
              setNewCategoryName("");
              setCategoryError("");
            }}
          >
            취소
          </button>
        </div>
      )}
      {categoryError && <p className="error">{categoryError}</p>}

      <div className="category-group">
        {categories.map((item) => (
          <div key={item.category_id} className="category-item-row">
            <button
              type="button"
              className={`category-select-btn ${selectedCategoryIds.includes(item.category_id) ? "active" : ""}`}
              onClick={() =>
                setSelectedCategoryIds((prev) =>
                  prev.includes(item.category_id)
                    ? prev.filter((id) => id !== item.category_id)
                    : [...prev, item.category_id]
                )
              }
            >
              {item.category_name}
            </button>

            {isCategoryEditMode && (
              editingCategoryId === item.category_id ? (
                <div className="category-inline-edit">
                  <input
                    type="text"
                    value={editingCategoryName}
                    className="admin-list-desc"
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    placeholder="카테고리 이름"
                  />
                  <button
                    type="button"
                    className="category-save-btn"
                    onClick={handleSaveCategoryName}
                    disabled={isUpdatingCategory}
                  >
                    {isUpdatingCategory ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    className="category-cancel-btn"
                    onClick={handleCancelEditCategory}
                    disabled={isUpdatingCategory}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="category-inline-edit-btn"
                  onClick={() => handleStartEditCategory(item)}
                  disabled={editingCategoryId !== null || isUpdatingCategory}
                >
                  수정
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
