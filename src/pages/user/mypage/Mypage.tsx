import "./Mypage.scss";

const Mypage = () => {
  return (
    <section className="mypage-main">
      <div className="mypage-profile">
        <div className="profile-image-wrap">
          <div className="profile-image" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="60" fill="#e9e3d3" />
              <path d="M25 66L45 48L60 60L73 50L95 66H25Z" fill="#c7c2af" />
              <path d="M45 66L64 50L80 66H45Z" fill="#495341" />
            </svg>
          </div>
          <button type="button" className="profile-edit" aria-label="프로필 이미지 수정">
            <span className="material-icons">edit</span>
          </button>
        </div>
        <h2 className="welcome-text">___님 반갑습니다</h2>
      </div>

      <div className="mypage-actions">
        <button type="button" className="action-card primary large">
          <span className="material-icons">shopping_cart</span>
          <span>장바구니</span>
        </button>
        <button type="button" className="action-card primary large">
          <span className="material-icons">edit</span>
          <span>리뷰관리</span>
        </button>

        <div className="action-row">
          <button type="button" className="action-card secondary small">
            <span className="material-icons">manage_accounts</span>
            <span>개인정보 수정</span>
          </button>
          <button type="button" className="action-card secondary outline small">
            <span className="material-icons">logout</span>
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      <div className="mypage-summary">
        <div className="summary-item">
          <span className="label">장바구니</span>
          <strong className="value">12</strong>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="label">쿠폰함</span>
          <strong className="value">3</strong>
        </div>
      </div>
    </section>
  );
};

export default Mypage;
