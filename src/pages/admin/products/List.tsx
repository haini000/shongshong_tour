export const dummyProducts = [
  {id: 1, name: "제주 여행", price: 300000, stock: 10},
  {id: 2, name: "부산 여행", price: 200000, stock: 5}
];

const List = ()=>{
  return (
    <div className="list-manage">
      <div className="list-header">
        <h1>상품 관리</h1>
        {/* 뒤로가기 버튼. 아이콘은 나중에 scss로 추가 */}
        <button className="Material-Icons">expand_less</button>
        <p>총 {dummyProducts.length}개의 여행 상품</p>
        <button>상품 추가 +</button>
      </div>

      <div className="search">
        <span className="Material Icons">search</span>
        <input type="text" placeholder="상품 검색"/>
      </div>

      <div className="lists">
        {dummyProducts.map((product) =>(
          <div key={product.id} className="list-item">
            <div>{product.name}</div>
            <div>{product.price.toLocaleString()}원</div>
            <div>{product.stock}</div>
            <button>수정</button>
            <button>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;