import { Helmet } from "react-helmet-async";

const Checkout = () => {
  return (
    <>
      <Helmet>
        <title>결제</title>
        <meta name="description" content="슝슝투어 결제" />
      </Helmet>
      <div className="main-content">
        <h2>결제 페이지</h2>
      </div>
    </>
  )
};

export default Checkout;