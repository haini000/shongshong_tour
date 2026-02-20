import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header>헤더</header>
      <Outlet />
      <footer>
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/Cart">장바구니</Link></li>
          </ul>
        </nav>
      </footer>
    </div>
  )
}

export default Layout;