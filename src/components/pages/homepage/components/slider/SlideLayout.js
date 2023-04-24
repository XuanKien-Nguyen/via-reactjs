import React from 'react';
import { Carousel, Button, Icon } from 'antd';

const SlideLayout = () => {
  const onChange = (currentSlide) => {
  };
  return (
    <section id="slider-layout">
      <Carousel afterChange={onChange} style={{ marginBottom: '30px' }} dots arrows>
        <div className='slide-item'>
          <div className='slide-text'>
              <div>
                <h1 className='slide-title'>Nền tảng mua bán Via Facebook, Clone, BM, Fanpage và tài nguyên số 1 Việt Nam</h1>
                <span className='slide-content'>Giao dịch hoàn toàn tự động, nhân viên hỗ trợ nhanh chóng. Tài nguyên an toàn, bảo mật.</span>
              </div>
              <Button type="primary" size='large' onClick={(e) => {
                console.log('click button')
              }}>
                XEM CHI TIẾT
                <Icon type="right" style={{fontSize: '12px'}}/>
              </Button>
          </div>
          <img alt='slide-item' src={require('../../../../../assets/img/slider-test.png')}/>
        </div>
        <div>
          <h1>2</h1>
        </div>
        <div>
          <h1>3</h1>
        </div>
      </Carousel>
    </section>
  );
};
export default SlideLayout;
