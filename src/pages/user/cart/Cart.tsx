import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Compass, ShoppingCart, ChevronLeft, X, User } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#5dade2', fontWeight: 'bold' }}>Shong Shong 여행 준비 중...</div>;

  return (
    <div style={{ backgroundColor: '#f8faff', minHeight: '100vh', display: 'flex', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '430px', backgroundColor: 'white', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 0 30px rgba(0,0,0,0.05)' }}>
        
        {/* 1. 상단 로고 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'center' }}>
          <span style={{ color: '#5dade2', fontSize: '26px', fontFamily: '"Pacifico", cursive' }}>
            Shong Shong Tour
          </span>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f0f7ff', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#5dade2' 
          }}>
            <User size={20} />
          </div>
        </div>

        {/* 2. 헤더 섹션 */}
        <div style={{ padding: '10px 20px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div 
              onClick={() => navigate(-1)}
              style={{ 
                backgroundColor: '#5dade2', color: 'white', width: '38px', height: '38px', borderRadius: '50%', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(93, 173, 226, 0.3)'
              }}>
              <ChevronLeft size={22} strokeWidth={2.5} />
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#333' }}>장바구니</h2>
          </div>
          <span style={{ color: '#5dade2', fontSize: '14px', fontWeight: '600' }}>나의 여행 리스트</span>
        </div>

        {/* 3. 장바구니 리스트 영역 */}
        <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: '240px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#bbb' }}>
              <ShoppingCart size={48} color="#eee" style={{ marginBottom: '15px' }} />
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
                  style={{ width: '95px', height: '95px', borderRadius: '18px', objectFit: 'cover' }} 
                />
                <div style={{ marginLeft: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontSize: '17px', color: '#1a1a1a' }}>{item.Product?.product_name}</b>
                    <X size={18} color="#ccc" style={{ cursor: 'pointer' }} onClick={() => deleteItem(item.cart_id)} />
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#999' }}>가격</span> 
                      <span style={{ color: '#4285f4', fontWeight: '700' }}>₩ {item.Product?.product_price?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#999' }}>출발일</span> 
                      <span style={{ color: '#555', fontWeight: '500' }}>{item.Product?.travel_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. 하단 고정 결제 및 네비바 */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', borderTop: '1px solid #f0f0f0', borderRadius: '30px 30px 0 0', boxShadow: '0 -10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '25px 25px 15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '17px', color: '#888', fontWeight: '500' }}>합계</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#1a3a8a' }}>₩ {totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={clearCart} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}>비우기</button>
              <button style={{ flex: 1.8, padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#4285f4', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 15px rgba(66, 133, 244, 0.3)' }}>주문하기</button>
            </div>
          </div>

          {/* 세련된 하단 네비게이션 */}
          <div style={{ height: '75px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '10px' }}>
            <div onClick={() => navigate('/')} style={{ textAlign: 'center', cursor: 'pointer', color: '#ccc' }}>
              <Home size={24} strokeWidth={1.5} />
              <div style={{ fontSize: '11px', marginTop: '4px' }}>홈</div>
            </div>
            <div style={{ textAlign: 'center', cursor: 'pointer', color: '#ccc' }}>
              <Compass size={24} strokeWidth={1.5} />
              <div style={{ fontSize: '11px', marginTop: '4px' }}>탐색</div>
            </div>
            <div style={{ textAlign: 'center', cursor: 'pointer', color: '#9b59b6' }}>
              <ShoppingCart size={24} strokeWidth={2.5} />
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>장바구니</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// test