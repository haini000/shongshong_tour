import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../lib/supabase"
import { Helmet } from 'react-helmet-async';

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Cart') 
      .select(`
        cart_id,
        Product (
          product_name,
          product_price,
          product_image,
          travel_date
        )
      `);
    
    if (error) console.error(error);
    else setCartItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const deleteItem = async (id: number) => {
    if (!window.confirm("상품을 삭제하시겠습니까?")) return;
    await supabase.from('Cart').delete().eq('cart_id', id);
    fetchCart();
  };

  const clearCart = async () => {
    if (!window.confirm("장바구니를 모두 비우시겠습니까?")) return;
    await supabase.from('Cart').delete().neq('cart_id', 0);
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.Product?.product_price || 0), 0);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#5dade2', fontWeight: 'bold' }}>
        Shong Shong 여행 준비 중...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>장바구니</title>
        <meta name="description" content="슝슝투어 장바구니" />
      </Helmet>
      <div style={{ backgroundColor: '#f8faff', minHeight: 'calc(100vh - 120px)', display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '430px', backgroundColor: 'white', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 0 30px rgba(0,0,0,0.05)' }}>
          
          {/* 장바구니 타이틀 영역 (헤더는 Layout에서 처리하므로 타이틀만 유지) */}
          <div style={{ padding: '20px 20px 25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              onClick={() => navigate(-1)}
              style={{ 
                backgroundColor: '#5dade2', color: 'white', width: '38px', height: '38px', borderRadius: '50%', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(93, 173, 226, 0.3)', fontSize: '20px', fontWeight: 'bold'
              }}>
              &lt;
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#333' }}>장바구니</h2>
          </div>

          {/* 장바구니 아이템 리스트 */}
          <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: '180px' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '100px', color: '#bbb' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛒</div>
                <p>장바구니가 비어있습니다.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.cart_id} style={{ 
                  display: 'flex', backgroundColor: 'white', borderRadius: '24px', padding: '18px', marginBottom: '18px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' 
                }}>
                  <img 
                    src={item.Product?.product_image || 'https://images.unsplash.com/photo-1500835595353-b0ad2e58b8df?w=400'} 
                    style={{ width: '90px', height: '90px', borderRadius: '18px', objectFit: 'cover' }} 
                  />
                  <div style={{ marginLeft: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: '17px', color: '#1a1a1a' }}>{item.Product?.product_name}</b>
                      <span style={{ cursor: 'pointer', color: '#ccc', fontSize: '18px', fontWeight: 'bold' }} onClick={() => deleteItem(item.cart_id)}>×</span>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#999' }}>가격</span> 
                        <span style={{ color: '#4285f4', fontWeight: '700' }}>₩ {item.Product?.product_price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 금액 합계 및 주문하기 버튼 섹션 */}
          <div style={{ 
            padding: '25px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0',
            borderRadius: '30px 30px 0 0', boxShadow: '0 -10px 30px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '17px', color: '#888', fontWeight: '500' }}>합계</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#1a3a8a' }}>₩ {totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={clearCart} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>비우기</button>
              <button style={{ flex: 1.8, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#4285f4', color: 'white', fontWeight: '700', cursor: 'pointer' }}>주문하기</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}