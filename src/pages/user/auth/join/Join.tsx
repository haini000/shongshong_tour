import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import "./Join.scss";

export default function Join() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    userId: "",
    password: "",
    passwordConfirm: "",
    emailId: "",
    emailDomain: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    userId: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      userId: "",
      password: "",
      passwordConfirm: "",
      email: "",
    };
    const passwordRule = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const emailIdRule = /^[A-Za-z0-9]+$/;
    const emailDomainRule = /^[A-Za-z]+(\.[A-Za-z]+)+$/;

    if (!form.name.trim()) {
      newErrors.name = "이름을 입력해 주세요.";
    }
    if (!form.userId.trim()) {
      newErrors.userId = "아이디를 입력해 주세요.";
    }
    if (!form.password.trim()) {
      newErrors.password = "비밀번호를 입력해 주세요.";
    } else if (!passwordRule.test(form.password)) {
      newErrors.password = "영문, 숫자 조합 8자 이상으로 입력해 주세요.";
    }
    if (!form.passwordConfirm.trim()) {
      newErrors.passwordConfirm = "비밀번호를 다시 한 번 확인해주세요.";
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    if (!form.emailId.trim() || !form.emailDomain.trim()) {
      newErrors.email = "이메일을 입력해 주세요.";
    } else if (!emailIdRule.test(form.emailId.trim())) {
      newErrors.email = "이메일 입력값은 영문과 숫자만 사용할 수 있습니다.";
    } else if (!emailDomainRule.test(form.emailDomain.trim())) {
      newErrors.email = "도메인은 영문과 . 형식으로 입력해 주세요. (예: naver.com)";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("회원가입 폼 데이터", form);
  };

  return (
    <div className="join">
      <div className="join__title">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <div>
          <h1>회원가입</h1>
          <p>숭숭투어와 함께 특별한 여행을 시작하세요.</p>
        </div>
      </div>

      <form className="join__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이름</label>
          <div className="input-wrap">
            <input
              type="text"
              placeholder=" "
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <span className="float-placeholder">이름을 입력해 주세요</span>
          </div>
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>아이디</label>
          <div className="input-wrap">
            <input
              type="text"
              placeholder=" "
              value={form.userId}
              onChange={(e) => handleChange("userId", e.target.value)}
            />
            <span className="float-placeholder">아이디를 입력해 주세요</span>
          </div>
          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <div className="input-wrap">
            <input
              type="password"
              placeholder=" "
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <span className="float-placeholder">영문, 숫자 조합 8자 이상</span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <div className="input-wrap">
            <input
              type="password"
              placeholder=" "
              value={form.passwordConfirm}
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
            />
            <span className="float-placeholder">
              비밀번호를 한번 더 입력해 주세요
            </span>
          </div>
          {errors.passwordConfirm && (
            <span className="error">{errors.passwordConfirm}</span>
          )}
        </div>

        <div className="form-group">
          <label>이메일</label>
          <div className="email-box">
            <div className="input-wrap">
              <input
                type="text"
                placeholder=" "
                value={form.emailId}
                onChange={(e) => handleChange("emailId", e.target.value)}
              />
              <span className="float-placeholder">이메일</span>
            </div>
            <span className="at">@</span>
            <div className="input-wrap">
              <input
                type="text"
                placeholder=" "
                value={form.emailDomain}
                onChange={(e) => handleChange("emailDomain", e.target.value)}
              />
              <span className="float-placeholder">도메인</span>
            </div>
          </div>
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <p className="agreement">
          가입 시 슝슝투어의 <span>이용약관</span> 및 <span>개인정보 처리방침</span>에 동의하게 됩니다.
        </p>

        <button type="submit" className="join-btn">회원가입 완료</button>
      </form>

      <div className="join__sns">
        <p>간편 가입</p>
        <div className="sns-icons">
          <div className="sns n">N</div>
          <div className="sns k">K</div>
          <div className="sns g">G</div>
        </div>
      </div>
    </div>
  );
}
