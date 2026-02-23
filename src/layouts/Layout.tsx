import Footer from "../components/user/footer/footer";
import Header from "../components/user/header/Header";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header/>
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