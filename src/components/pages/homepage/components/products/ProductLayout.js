import React from 'react';
import ListLayout from '../../../common/ListLayout';
import ProductCard from './ProductCard';

const ProductLayout = () => {

  return (
    <section id='product-layout'>
      <ListLayout titleCatagory={'SẢN PHẨM BÁN CHẠY NHẤT'} contentSeeMore={'Xem thêm !'} cardComponent={<ProductCard />}></ListLayout>
    </section>
  );
};
export default ProductLayout;
