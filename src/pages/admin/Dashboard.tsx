import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import '../../../css/Dashboard.css'

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
    <div className="admin-dashboard">
      <h1 className="admin-title">관리자 페이지</h1>

      <div className="admin-menu">
        <div className="admin-card">상품 관리</div>
        <div className="admin-card">회원 관리</div>
        <div className="admin-card">공지 관리</div>
        <div className="admin-card">쿠폰 관리</div>
      </div>
    </div>
  );
};

export default Dashboard;