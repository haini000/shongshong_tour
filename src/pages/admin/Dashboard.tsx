import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const Dashboard = () => {
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("Product")
        .select("*");

      console.log("상품 데이터:", data);
      console.log("에러:", error);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>관리자 대쉬보드</h1>
      <p>관리자 전용 페이지입니다.</p>
    </div>
  );
};

export default Dashboard;