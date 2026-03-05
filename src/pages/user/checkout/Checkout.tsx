import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { supabase } from "../../../lib/supabase";
import './Checkout.scss';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartTotal, setCartTotal] = useState(0); // 1. 장바구니 합계 상태
  const [discount, setDiscount] = useState(0);   // 2. 할인 금액 상태
  const [loading, setLoading] = useState(true);

  const clientKey = 'test_ck_GePWvyJnrKJqoleKgWLbVgLzN97E'; 

  // 데이터 로드: 장바구니 합계 계산
  useEffect(() => {
    const getCartData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 장바구니 아이템과 상품 가격 조인
      const { data, error } = await supabase
        .from('Cart')
        .select(`
          people_number,
          Product ( product_price )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else {
        // 합계 계산 (가격 * 인원수)
        const total = data.reduce((acc, item: any) => 
          acc + (item.Product.product_price * item.people_number), 0);
        setCartTotal(total);
        
      }
      setLoading(false);
    };

    getCartData();
  }, [navigate]);

  const handlePayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tossPayments = await loadTossPayments(clientKey);
    const orderId = `shong_${Date.now()}`;
    const finalAmount = cartTotal - discount; // 최종 결제 금액

    try {
      await tossPayments.requestPayment('카드', {
        amount: finalAmount,
        orderId: orderId,
        orderName: '슝슝투어 여행 상품',
        successUrl: `${window.location.origin}/main`, 
        failUrl: `${window.location.origin}/fail`,
        customerEmail: user.email,
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="checkout-container">
      <div className="header">
        <div className="back-btn" onClick={() => navigate(-1)}>&lt;</div>
        <h2>결제 확인 및 요약</h2>
      </div>

      <div className="summary-card">
        <div className="row">
          <span>총 상품 금액</span>
          <b>₩ {cartTotal.toLocaleString()}</b> {/* 1. 합계 반영 */}
        </div>
        <div className="row discount">
          <span>할인 금액</span>
          <b>- ₩ {discount.toLocaleString()}</b> {/* 2. 할인 반영 */}
        </div>
        <div className="divider"></div>
        <div className="total-row">
          <span>최종 결제 금액</span>
          <span className="price">₩ {(cartTotal - discount).toLocaleString()}</span>
        </div>
      </div>

      <div className="payment-method">
        <label>결제 수단 선택</label>
        <div className="card-selector">
          <span>💳</span>
          <b>신용카드</b>
        </div>
      </div>

      <div className="security-info">
        <div className="icon">🛡️</div>
        <div className="text">
          <b>안전 결제 시스템</b>
          <p>당신의 모든 결제 정보는 암호화되어 안전하게 보호됩니다.</p>
        </div>
      </div>

      <div className="submit-container">
        <button className="submit-btn" onClick={handlePayment}>
          결제하기 →
        </button>
      </div>
    </div>
  );
}