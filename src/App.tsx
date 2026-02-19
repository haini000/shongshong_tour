import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
