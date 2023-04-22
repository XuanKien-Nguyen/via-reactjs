import React from 'react';
import SlideLayout from './components/SlideLayout';
import FeatureLayout from './components/FeatureLayout';
import ProductLayout from '../../../layout/user/products/ProductLayout';
import BlogLayout from './components/BlogLayout';
import QandALayout from './components/QandALayout';

const HomePage = () => {

  return (
    <div>
        <SlideLayout />
        <FeatureLayout />
        <ProductLayout />
        <QandALayout />
        <BlogLayout />
    </div>
  );
};
export default HomePage;
