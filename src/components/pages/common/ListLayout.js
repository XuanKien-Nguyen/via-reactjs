import React from 'react';
import {Row, Col, Icon} from 'antd';

const ListLayout = ({titleCatagory, contentSeeMore, cardComponent}) => {
    const productList = new Array(7).fill(cardComponent);

  return (
    <div className='category-container'>
        <div className='category-title'><h3 className='title-content'><b><span>{titleCatagory}</span></b><a>{contentSeeMore}<Icon type="right" /></a></h3></div>
        {/* <Row gutter={[16, 16]}>
            {productList.map(product => <Col span={6} >{product}</Col>)}
        </Row> */}
        <div className='category-grid'>
          {productList.map(product => <div>{product}</div>)}
        </div>
    </div>
  );
};
export default ListLayout;
