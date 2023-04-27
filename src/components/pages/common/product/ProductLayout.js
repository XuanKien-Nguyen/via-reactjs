import React from 'react';
import ListLayout from '../list-layout/ListLayout';
import ProductCard from './ProductCard';

const ProductLayout = ({categoryParent, hiddenShowMore = false}) => {
    return (
    <section id='product-layout'>
      <ListLayout titleCategory={categoryParent.name} hiddenShowMore={hiddenShowMore} contentSeeMore={'Xem thêm'} categoryId={categoryParent.id} cardComponent={<ProductCard />}>
        {categoryParent.childCategoryList.map(product => <ProductCard key={product.id} productDetail={product}/>)}
      </ListLayout>
    </section>
  );
};
export default ProductLayout;
