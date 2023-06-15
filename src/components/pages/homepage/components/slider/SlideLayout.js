import React from 'react';
import {Carousel} from 'antd';
import SliderItem from "./SliderItemComponent";

const SlideLayout = ({sliderList}) => {
  return (
    <section id="slider-layout">
      <Carousel dots arrows>
        {sliderList.map(slider => <SliderItem key={slider.id} sliderDetail={slider} />)} 
      </Carousel>
    </section>
  );
};
export default SlideLayout;
