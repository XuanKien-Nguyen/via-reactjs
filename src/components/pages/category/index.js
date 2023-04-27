import React, { useState, useEffect } from 'react';
import BreadCrumb from './components/breadcrumb/BreadCrumb';
import FilterLayout from './components/filter/FilterLayout';
import ProductLayout from '../common/product/ProductLayout';

export default () => {
  const [resultSearch, setResultSearch] = useState([]);

  const query = new URLSearchParams(window.location.search);

  const [parentId, setParentId] = useState(null)

    useEffect(() => {
        const id = query.get('id')
        if (id) {
            setParentId(id)
        }
    }, [])

  return (
    <div className='product-page'>
        {/*<BreadCrumb />*/}
        <FilterLayout setResultSearch={setResultSearch} parentId={parentId} />
            {resultSearch.length === 0 ? <h1 align={'center'}>Không tìm thấy sản phẩm</h1> : resultSearch.map((el, idx) => <ProductLayout key={idx} hiddenShowMore={true} categoryParent={el} />)}
    </div>
  );
};