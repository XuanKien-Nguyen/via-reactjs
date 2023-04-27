import React, { useState, useEffect } from 'react';
import SlideLayout from './components/slider/SlideLayout';
import FeatureLayout from './components/feature/FeatureLayout';
import ProductLayout from '../common/product/ProductLayout';
import BlogLayout from './components/blog/BlogLayout';
import QandALayout from './components/QandA/QandALayout';

import { getCategoryList } from '../../../services/category/category';

const HomePage = () => { 

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList().then(res => {
      if(res.status === 200 && res.data) {
        setCategoryList(res.data.categoryListFound);
      }
    });
  }, []);

  return (
    <div>
        <SlideLayout />
        <FeatureLayout />
          {categoryList.map(category => <ProductLayout key={category.id} categoryParent={category} />)}
        {/* <ProductLayout /> */}
        <QandALayout />
        <BlogLayout />
    </div>
  );
};
export default HomePage;
