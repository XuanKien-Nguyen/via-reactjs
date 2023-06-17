import React from 'react';

export default ({postDetail}) => {

    return (
    <div className='post-page'>
        Post Page
        {postDetail.title}
    </div>
  );
};
