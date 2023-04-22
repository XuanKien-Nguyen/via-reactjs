import React from 'react';
import { Carousel } from 'antd';

const SlideLayout = () => {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    <section id="slider-layout">
      <Carousel afterChange={onChange} style={{ marginBottom: '30px' }} dots arrows>
        <div>
          <h1>1</h1>
        </div>
        <div>
          <h1>2</h1>
        </div>
        <div>
          <h1>3</h1>        </div>
      </Carousel>
    </section>
  );
};
export default SlideLayout;
