import React from 'react';
import ListLayout from '../list-layout/ListLayout';
import ProductCard from './ProductCard';

import { useTranslation } from 'react-i18next';

const ProductLayout = ({categoryParent, hiddenShowMore = false}) => {

  const { t } = useTranslation()

    return (
    <section id='product-layout'>
      <ListLayout titleCategory={categoryParent.name} hiddenShowMore={hiddenShowMore} contentSeeMore={t('category.view-more')} categoryId={categoryParent.id}>
        {categoryParent.childCategoryList.map(product => <ProductCard key={product.id} productDetail={product}/>)}
      </ListLayout>
    </section>
  );
};
export default ProductLayout;
