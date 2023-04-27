import React, { useState, useEffect } from 'react';
import BreadCrumb from './components/breadcrumb/BreadCrumb';
import FilterLayout from './components/filter/FilterLayout';

const ProductPage = () => { 

  return (
    <div className='product-page'>
        <BreadCrumb />
        <FilterLayout />
        Product Page
    </div>
  );
};
export default ProductPage;
