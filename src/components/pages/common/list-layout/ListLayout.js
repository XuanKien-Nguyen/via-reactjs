import React from 'react';
import {useHistory} from "react-router-dom";

const ListLayout = ({categoryId, children, titleCategory, hiddenShowMore, contentSeeMore}) => {

    const history = useHistory()

    return (
    <div className='category-container'>
        <div className='category-title'>
            <h3 className='title-content'>
                <b>
                    <div>{titleCategory}</div>
                </b>
                {!hiddenShowMore && <a onClick={() => history.push(`/categories?id=${categoryId}`)}>{contentSeeMore}</a>}
            </h3>
        </div>
        <div className='category-grid'>
          {children}
        </div>
    </div>
  );
};
export default ListLayout;
