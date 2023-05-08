import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Breadcrumb } from 'antd';

const BreadCrumbUser = ({history}) => {

  const breadcrumb = useSelector(store => store.system.breadscrumb);

  return (
    <div className='breadcrumb-layout layout-lg'>
      <Breadcrumb>
        <Breadcrumb.Item><a className='uppercase' href="" onClick={() => history.push('/')}>Trang chủ</a></Breadcrumb.Item>
        <Breadcrumb.Item>
          <a className='uppercase' href="" onClick={() => {history.push(breadcrumb.path)}}>{breadcrumb.name}</a>
        </Breadcrumb.Item>
        {
          breadcrumb?.children ? <Breadcrumb.Item>
          <a className='uppercase' href="" style={{pointerEvents: 'none'}}>{breadcrumb.children}</a>
        </Breadcrumb.Item> : ''
        }
      </Breadcrumb>
    </div>
  );
};
export default BreadCrumbUser;
