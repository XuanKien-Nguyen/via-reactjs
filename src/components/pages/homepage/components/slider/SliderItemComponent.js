import React from 'react';
import {useHistory} from 'react-router-dom';
import { Button, Icon } from 'antd';

const SliderItem = ({sliderDetail}) => {

  const history = useHistory();

  return (
        <div className='slide-item'>
          <div className='slide-item-container'>
            <div className='slide-text'>
              <div>
                <h1 className='slide-title'>{sliderDetail.title.toUpperCase()}</h1>
                <span className='slide-content'>{sliderDetail.sub_title}</span>
              </div>
              {sliderDetail.slug && <Button type="primary" size='large' onClick={() => {
                history.push(`/blog/${sliderDetail.slug}`)
              }}>
                XEM CHI TIẾT
                <Icon type="right" style={{ fontSize: '12px' }} />
              </Button>}
            </div>
            <img alt='slide-item' src={sliderDetail.post_img} />
          </div>
        </div>
  );
};
export default SliderItem;
