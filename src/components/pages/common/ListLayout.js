import React from 'react';
import {Icon} from 'antd';
import {useHistory} from "react-router-dom";

const ListLayout = ({categoryId, children, titleCategory, contentSeeMore}) => {

    const history = useHistory()

    return (
    <div className='category-container'>
        <div className='category-title'><h3 className='title-content'><b><span>{titleCategory}</span></b><a onClick={() => history.push(`/category?id=${categoryId}`)}>{contentSeeMore}<Icon type="right" /></a></h3></div>
        <div className='category-grid'>
          {children}
        </div>
    </div>
  );
};
export default ListLayout;
