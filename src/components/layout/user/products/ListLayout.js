import React from 'react';
import {Row, Col, Icon} from 'antd';

const ListLayout = ({titleCatagory, contentSeeMore, cardComponent}) => {
    const productList = new Array(7).fill(cardComponent);

  return (
    <div className='product-category'>
        <div className='category-title'><h3 className='title-content'><b><span>{titleCatagory}</span></b><a>{contentSeeMore}<Icon type="right" /></a></h3></div>
        <Row gutter={[16, 16]}>
            {productList.map(product => <Col span={6} >{product}</Col>)}
        </Row>
    </div>
  );
};
export default ListLayout;
