import React from 'react';
import SlideLayout from './components/slider/SlideLayout';
import FeatureLayout from './components/feature/FeatureLayout';
import ProductLayout from './components/products/ProductLayout';
import BlogLayout from './components/blog/BlogLayout';
import QandALayout from './components/QandA/QandALayout';

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
