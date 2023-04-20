import React from 'react';
import {Row, Col, Icon} from 'antd';
import ProductCard from './ProductCard';

const ProductCategory = () => {
    const productList = new Array(8).fill(<Col span={6} ><ProductCard /></Col>);

  return (
    <div className='product-category'>
        <div className='category-title'><h3 className='title-content'><b><span>TITLE CATEGORY</span></b><a>Xem thêm ! <Icon type="right" /></a></h3></div>
        <Row gutter={[16, 16]}>
            {productList.map(product => product)}
        </Row>
    </div>
  );
};
export default ProductCategory;
