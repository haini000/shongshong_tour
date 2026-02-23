import Header from "../components/user/Header";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header/>
      <main>
        <Outlet />
      </main>
      <footer>
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            {/* <li><Link to="/Search">탐색</Link></li> */}
            <li><Link to="/Cart">장바구니</Link></li>
            {/* <li><Link to="/Setting">설정</Link></li> */}
          </ul>
        </nav>
      </footer>
    </div>
  )
}

export default Layout;