import React, { useState, useEffect } from 'react';
import SlideLayout from './components/slider/SlideLayout';
import FeatureLayout from './components/feature/FeatureLayout';
import ProductLayout from '../common/product/ProductLayout';
import BlogLayout from './components/blog/BlogLayout';
import QandALayout from './components/QandA/QandALayout';

import { getCategoryList } from '../../../services/category/category';
import {getPostListCommon} from "../../../services/post";

const HomePage = () => { 

  const [categoryList, setCategoryList] = useState([]);
  const [blogList, setBlogList] = useState([])

  useEffect(() => {
    getCategoryList().then(res => {
      if(res.status === 200 && res.data) {
        setCategoryList(res.data.categoryListFound);
      }
    });
    getPostListCommon().then(resp => {
      if (resp?.data) {
        setBlogList(resp?.data?.postList || [])
      }
    }).catch(err => console.log(err))
  }, []);

  return (
    <div>
        <SlideLayout sliderList={blogList}/>
        <FeatureLayout />
          {categoryList.map(category => <ProductLayout key={category.id} categoryParent={category} />)}
        <QandALayout />
        <BlogLayout blogList={blogList?.slice(0, 8)}/>
    </div>
  );
};
export default HomePage;
