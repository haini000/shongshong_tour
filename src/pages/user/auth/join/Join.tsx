import "./Join.scss";

export default function Join() {
  return (
    <div className="join">
      {/* 타이틀 */}
      <div className="join__title">
        <h1>회원가입</h1>
        <p>숭숭투어와 함께 특별한 여행을 시작하세요.</p>
      </div>

      {/* 폼 */}
      <div className="join__form">
        <div className="form-group">
          <label>이름</label>
          <input type="text" placeholder="이름을 입력해 주세요" />
        </div>

        <div className="form-group">
          <label>아이디</label>
          <input type="text" placeholder="아이디를 입력해 주세요" />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" placeholder="영문, 숫자 조합 8자 이상" />
          <span className="error">영문, 숫자 조합 8자 이상</span>
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 한번 더 입력해 주세요"
          />
        </div>

        <div className="form-group">
          <label>이메일</label>
          <div className="email-box">
            <input type="text" placeholder="이메일" />
            <span>@</span>
            <input type="text" placeholder="도메인" />
          </div>
        </div>

        <p className="agreement">
          가입 시 <span>이용약관</span> 및 <span>개인정보 처리방침</span>에 동의합니다.
        </p>

        <button className="join-btn">회원가입 완료</button>
      </div>

      {/* SNS */}
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