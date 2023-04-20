import React from 'react';
import { Input, Icon, Layout } from 'antd';
const { Search } = Input;
const { Header } = Layout;

function HeaderLayout() {

  return (
    <Header id='header_user' style={{ height: 'auto', padding: 0, margin: 0 }}>
      <div id="top-bar" className="header-top" style={{ backgroundColor: '#1b74e4', height: '40px', lineHeight: '40px' }}>
        <div className='header-top_container'>
          <div className="header-top_left"><Search
            type='search'
            placeholder="Bạn đang tìm gì?"
            onSearch={value => console.log(value)}
            style={{ width: 156, color: 'white' }}
          /></div>
          <div className='header-top_right'>
            <ul>
              <li className='item'><a href='#'>Item</a></li>
              <li className='item'><a href='#'>Item</a></li>
              <li className='item'><a href='#'>Item</a></li>
              <li className='item'><a href='#'>Item</a></li>
              <li className='item'><a href='#'>Item</a></li>
              <li className='item'><a href='#'>Item</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div id="master-header" className="header-main" style={{ height: '63px' }}>
        <div className='header-main_container'>
          <div className='header-logo' style={{marginRight: '30px'}}>
            <img alt='via2fa' src={require('../../../assets/img/clone-logo.gif')} style={{width: '135px'}} />
          </div>
          <div className="header-main_left">
              <ul>
                <li className='item'><a href='#'>ITEM</a></li>
                <li className='item'><a href='#'>ITEM</a></li>
                <li className='item'><a href='#'>ITEM</a></li>
                <li className='item'><a href='#'>ITEM</a></li>
                <li className='item'><a href='#'>ITEM</a></li>
                <li className='header-devider'></li>
                <li className='item'><div className='item-button'><a href='#'>ITEM</a></div></li>
              </ul>
            </div>
            <div className="header-main_right">
              <ul>
                  <li className='item'><div className='signin-signup'><a>ĐĂNG NHẬP / ĐĂNG KÝ</a></div></li>
                  <li className='header-devider'></li>
                  <li className='item'><div className='notify'><Icon type="bell" theme="filled" style={{ fontSize: '20px'}} /></div></li>
                </ul>
            </div>
        </div>
      </div>
    </Header>
  );
}

export default HeaderLayout;
