import React, { useState, useEffect } from 'react';
import FilterLayout from './components/filter/FilterLayout';
import ProductLayout from '../common/product/ProductLayout';
import '../../../assets/scss/category.scss';

import { useTranslation } from 'react-i18next';

export default () => {

  const { t } = useTranslation()

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
    <div className='product-page layout-lg'>
        <FilterLayout setResultSearch={setResultSearch} parentId={parentId} />
        <div className='product-page_category'>
          {resultSearch.length === 0 ? <h1 style={{marginTop: '40px'}} align={'center'}>{t('category.no-product')}</h1> : resultSearch.map((el, idx) => <ProductLayout key={idx} hiddenShowMore={true} categoryParent={el} />)}
        </div>
    </div>
  );
};
