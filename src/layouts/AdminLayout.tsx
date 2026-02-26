import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Header from "../components/admin/header/Header";
import Footer from "../components/admin/footer/Footer";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasCheckedAccess = useRef(false);

  useEffect(() => {
    if (hasCheckedAccess.current) return;
    hasCheckedAccess.current = true;

    const checkRole = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          alert("관리자만 접근할 수 있습니다.");
          navigate("/", { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from("User")
          .select("user_role")
          .eq("user_id", user.id)
          .single();

        const role = data?.user_role?.toLowerCase?.() ?? "";

        if (error || role !== "admin") {
          alert("관리자만 접근할 수 있습니다.");
          navigate("/", { replace: true });
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("관리자 권한 확인 실패:", error);
        alert("관리자 권한 확인 중 오류가 발생했습니다.");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void checkRole();
  }, [navigate]);

  if (loading) return <div>불러오는 중...</div>;

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="admin">
      <Header />
      <main className="admin_content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
