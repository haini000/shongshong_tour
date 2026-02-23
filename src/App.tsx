import { Routes, Route } from "react-router-dom";

/* 사용자 관련 페이지 */

/*
import Layout from "./layouts/Layout"
import Main from "./pages/user/main/Main";
import Cart from "./pages/user/cart/Cart";
*/

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
      {/* <Route path="/" element={<Layout/>}>
        <Route index element={<Main/>}/>
        <Route path="cart" element={<Cart/>}/>
      </Route> */}

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
