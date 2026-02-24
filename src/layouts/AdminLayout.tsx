import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Outlet, Navigate } from "react-router-dom";
import Footer from "../components/admin/footer/footer";
import "./AdminLayout.scss"

const AdminLayout = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 🔹 로그인 안 한 경우
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      // 🔹 DB에서 role 조회
      const { data, error } = await supabase
        .from("User")
        .select("user_role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        setRole(null);
      } else {
        setRole(data?.user_role ?? null);
      }

      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) return <div>불러오는 중...</div>;

  // 로그인 안 했거나 ADMIN 아니면 튕김
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin">
      <header className="admin_header">
        <h1>Shong Shong Tour</h1>
      </header>

      <main className="admin_content">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default AdminLayout;