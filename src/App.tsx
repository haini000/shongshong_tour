import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import New from "./pages/admin/products/New";
import Edit from "./pages/admin/products/Edit";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Dashboard/>}/>
        <Route path="/admin/products/new" element={<New/>}/>
        <Route path="/admin/products/:id/edit" element={<Edit/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
