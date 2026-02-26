import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/supabase"; 
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Supabase Auth 로그인 시도
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 🔹 세션이 브라우저에 확실히 저장될 때까지 잠시 대기하거나 유저 정보를 다시 확인합니다.
      if (authData?.user) {
        
        // 2. User 테이블에서 user_role 확인 (Edit.tsx의 fetch 패턴 적용)
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("user_role")
          .eq("user_email", email.trim()) // 공백 제거 후 비교
          .single();

        if (userError || !userData) {
          console.error("DB 권한 조회 실패:", userError);
          // 권한 조회 실패 시 기본 페이지로 이동시키되 세션은 유지됨
          navigate("/"); 
          return;
        }

        // 3. user_role 값 확인 (대소문자 구분 주의)
        // DB에 저장된 값이 'admin'인지 'ADMIN'인지 확인이 필요합니다.
        const role = userData.user_role.toLowerCase();

        if (role === "admin") {
          alert("관리자 계정으로 로그인되었습니다.");
          navigate("/admin"); 
        } else {
          alert("로그인 성공!");
          navigate("/"); 
        }
      }
    } catch (error: any) {
      alert(`로그인 실패: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <span className="icon-circle">〈</span>
        </button>
        <h2>로그인</h2>
        <p>여행의 시작, 숑숑투어와 함께하세요</p>
      </header>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="아이디(이메일)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-helper">
          <button type="button" className="text-link">비밀번호를 잊으셨나요?</button>
        </div>

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? "확인 중..." : "로그인"}
        </button>

        <div className="signup-prompt">
          계정이 없으신가요? <span onClick={() => navigate("/join")}>회원가입</span>
        </div>
      </form>

      {/* 디자인을 위한 소셜 로그인 섹션 유지 */}
      <section className="social-login">
        <div className="divider"><span>간편 로그인</span></div>
        <div className="social-buttons">
          <div className="social-item naver">
            <span className="logo">N</span>
            <span className="label">네이버로 시작하기</span>
            <span className="arrow">〉</span>
          </div>
          <div className="social-item kakao">
            <span className="logo">K</span>
            <span className="label">카카오로 시작하기</span>
            <span className="arrow">〉</span>
          </div>
          <div className="social-item google">
            <span className="logo">G</span>
            <span className="label">Google로 시작하기</span>
            <span className="arrow">〉</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;