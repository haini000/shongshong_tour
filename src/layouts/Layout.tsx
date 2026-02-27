import Footer from "../components/user/footer/footer";
import Header from "../components/user/header/Header";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  cartCount: number;
}

const Layout = ({ cartCount }: LayoutProps) => {
  
  return (
    <div>
      {}
      <Header cartCount={cartCount} />
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout;