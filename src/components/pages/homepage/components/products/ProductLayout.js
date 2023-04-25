import React from 'react';
import ListLayout from '../../../common/ListLayout';
import ProductCard from './ProductCard';

const ProductLayout = ({categoryParent}) => {
  return (
    <section id='product-layout'>
      <ListLayout titleCategory={categoryParent.name} contentSeeMore={'Xem thêm !'} cardComponent={<ProductCard />}>
        {categoryParent.childCategoryList.map(product => <ProductCard key={product.id} productDetail={product}/>)}
      </ListLayout>
    </section>
  );
};
export default ProductLayout;
