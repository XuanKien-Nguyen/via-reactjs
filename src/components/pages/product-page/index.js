import React, { useState, useEffect } from 'react';
import BreadCrumb from './components/breadcrumb/BreadCrumb';
import FilterLayout from './components/filter/FilterLayout';
import ProductLayout from '../common/product/ProductLayout';

const ProductPage = () => {
  const [resultSearch, setResultSearch] = useState([]);
  return (
    <div className='product-page'>
        {/*<BreadCrumb />*/}
        <FilterLayout setResultSearch={setResultSearch}/>
            {resultSearch.length === 0 ? <h1>Không tìm thấy sản phẩm</h1> : resultSearch.map((el, idx) => <ProductLayout key={idx} categoryParent={el} />)}
    </div>
  );
};
export default ProductPage;
