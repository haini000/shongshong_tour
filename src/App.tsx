import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import "./lib/supabase";

/* 사용자 관련 페이지 */
import Layout from "./layouts/Layout"
import Main from "./pages/user/main/Main"
import Login from "./pages/user/auth/login/Login";
import Join from "./pages/user/auth/join/Join";
import Product from "./pages/user/products/Product";
import Cart from "./pages/user/cart/Cart";
import Checkout from "./pages/user/checkout/Checkout";

/* 관리자 관련 페이지 */
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import List from "./pages/admin/products/List";
import New from "./pages/admin/products/New";
import Edit from "./pages/admin/products/Edit";

// 슈퍼베이스 연결
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const { count } = await supabase
        .from('Cart')
        .select('*', { count: 'exact', head: true });
      setCartCount(count || 0);
    };
    fetchCartCount();
  }, []);

  return (
    <>
      {}
      {}
      
      <Routes>
        {/* 유저 페이지 */}
        <Route path="/" element={<Layout cartCount={cartCount} />}>
          <Route index element={<Main/>}/>
          <Route path="login" element={<Login />}/>
          <Route path="join" element={<Join />} />
          <Route path="product/:productNumber" element={<Product/>}/>
          <Route path="cart" element={<Cart />}/>
          <Route path="checkout" element={<Checkout />}/>
        </Route>

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="products" element={<List/>}/>
          <Route path="products/new" element={<New/>}/>
          <Route path="products/:id/edit" element={<Edit/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App;