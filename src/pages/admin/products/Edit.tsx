import { useParams } from "react-router-dom";

const Edit = ()=>{
  const {id} = useParams();

  return <h1>{id}번 상품 수정 페이지</h1>;
};

export default Edit;