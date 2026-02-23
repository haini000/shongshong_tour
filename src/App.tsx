import { Routes, Route } from "react-router-dom";
import "./lib/supabase";

// 컴포넌트 

import Header from "./components/user/Header";

/* 사용자 관련 페이지 */

import Layout from "./layouts/Layout"
import Main from "./pages/user/main/Main"
import Login from "./pages/user/auth/Login";
import Join from "./pages/user/auth/Join";
import Product from "./pages/user/products/Product";
import Cart from "./pages/user/cart/Cart";
import Checkout from "./pages/user/checkout/Checkout";

/* 관리자 관련 페이지 */

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import List from "./pages/admin/products/List";
import New from "./pages/admin/products/New";
import Edit from "./pages/admin/products/Edit";

function App() {

  return (
    <Routes>
      {/* 유저 페이지 */}
      <Route path="/" element={<Layout/>}>
        <Route index element={<Main/>}/>
        <Route path="login" element={<Login />}/>
        <Route path="join" element={<Join />} />
        <Route path="product/:productNumber" element={<Product/>}/>
        <Route path="cart" element={<Cart />}/>
        <Route path="checkout" element={<Checkout />}/>
      </Route>
       
      {/* <Route path="*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Main />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/join" element={<Join />} />
              <Route path="/product/:productNumber" element={<Product/>}/>
              <Route path="/cart" element={<Cart />}/>
              <Route path="/checkout" element={<Checkout />}></Route>
            </Routes>
          </>
        } /> */}

      {/* 관리자 페이지 */}
      <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="products" element={<List/>}/>
        <Route path="products/new" element={<New/>}/>
        <Route path="products/:id/edit" element={<Edit/>}/>
      </Route>
    </Routes>
  )
}

export default App
