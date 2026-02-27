import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('Product').select('*');
      setProducts(data || []);
    };
    fetchProducts();
  }, []);

  const addToCart = async (product: any) => {
    const { error } = await supabase
      .from('Cart')
      .insert([
        { 
          product_number: product.id, // 상품의 ID~~
          people_number: 2,           // 기본 2명~
        }
      ]);

    if (error) {
      console.error(error);
      alert("담기 실패! 다시 시도해 주세요.");
    } else {
      if (window.confirm("장바구니에 담겼습니다! 장바구니로 이동할까요?")) {
        navigate('/cart');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>추천 여행지</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={product.product_image} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h4 style={{ margin: '5px 0' }}>{product.product_name}</h4>
              <p style={{ fontWeight: 'bold', color: '#007bff' }}>₩{product.product_price.toLocaleString()}</p>
              <button 
                onClick={() => addToCart(product)}
                style={{ width: '100%', padding: '8px', backgroundColor: '#007bff', color: '#white', border: 'none', borderRadius: '5px' }}
              >
                장바구니 담기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
