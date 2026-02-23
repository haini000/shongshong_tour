import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // console.log("role", role);

  useEffect(()=>{
    const checkRole = async () => {
      const { data:{ user } } = await supabase.auth.getUser();

      if(!user){
        setRole(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("User")
        .select("user_role")
        .eq("user_id", user.id)
        .single();

      setRole(data?.user_role ?? null);
      setLoading(false);
    };
    
    checkRole();
  }, []);

  if (loading) return <div>불러오는 중 . . .</div>;

  // 주석 처리 -> 오류 문제로 임시 해제 
  if (role !== "ADMIN") return <Navigate to="/" />;

  return (
    <div>
      <div className="admin">
        <header className="admin_header">
          <h1>Shong Shong Tour</h1>
        </header>

        <main className="admin_content">
          <Outlet/>
        </main>

        <nav className="admin_bottom">
          <Link to="/admin">대시보드</Link>
          <Link to="/admin/products">상품관리</Link>
          {/* <Link to="/admin/customer">회원관리</Link>
          <Link to="/admin/notification">공지관리</Link>
          <Link to="/admin/coupon">쿠폰관리</Link> */}
        </nav>

      </div>
    </div>
  );
};

export default AdminLayout;