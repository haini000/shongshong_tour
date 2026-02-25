import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Header from "../components/admin/header/Header";
import Footer from "../components/admin/footer/Footer";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

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

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin">
      <Header/>
      <main className="admin_content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
