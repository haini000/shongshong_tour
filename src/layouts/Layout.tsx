import Footer from "../components/user/footer/footer";
import Header from "../components/user/header/Header";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {

  //vercel 배포 오류 link 사용 시 제거 
  console.log(Link);
  
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