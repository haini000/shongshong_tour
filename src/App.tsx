import { BrowserRouter, Routes, Route } from "react-router-dom";

// 컴포넌트 

import Header from "./components/user/Header";

/* 사용자 관련 페이지 */
import Main from "./pages/user/main/Main"
import Login from "./pages/user/auth/Login";
import Join from "./pages/user/auth/Join";
import Product from "./pages/user/products/Product";
import Cart from "./pages/user/cart/Cart";
import Checkout from "./pages/user/checkout/Checkout";

/* 관리자 관련 페이지 */
import Dashboard from "./pages/admin/Dashboard";
import New from "./pages/admin/products/New";
import Edit from "./pages/admin/products/Edit";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 페이지
        {/* <Route path="/" element={<Main />}/> */}

        {/* 관리자 페이지 */}
        {/* <Route path="/admin" element={<Dashboard/>}/>
        <Route path="/admin/products/new" element={<New/>}/>
        <Route path="/admin/products/:id/edit" element={<Edit/>}/> */}

        <Route path="*" element={
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
        } />

        <Route path="/admin/*" element={
          <>
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products/new" element={<New />} />
              <Route path="/admin/products/:id/edit" element={<Edit />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
