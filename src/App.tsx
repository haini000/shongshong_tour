import { BrowserRouter, Routes, Route } from "react-router-dom";

// 컴포넌트 

import Header from "./components/user/Header";

/* 사용자 관련 페이지 */
import Main from "./pages/user/main/Main"

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
