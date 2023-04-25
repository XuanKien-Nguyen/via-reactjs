import React from 'react';
import {Icon} from 'antd';

const ListLayout = ({children, titleCategory, contentSeeMore}) => {

  return (
    <div className='category-container'>
        <div className='category-title'><h3 className='title-content'><b><span>{titleCategory}</span></b><a>{contentSeeMore}<Icon type="right" /></a></h3></div>
        <div className='category-grid'>
          {children}
        </div>
    </div>
  );
};
export default ListLayout;
