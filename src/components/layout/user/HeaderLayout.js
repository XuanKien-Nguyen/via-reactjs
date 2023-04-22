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
              <li className='item'><a href='#'>Tất cả sản phẩm</a></li>
              <li className='item'><a href='#'>Hướng dẫn</a></li>
              <li className='item'><a href='#'>Nạp tiền</a></li>
              <li className='item'><a href='#'>Thủ thuật Facebook</a></li>
              <li className='item'><a href='#'>Về chúng tôi</a></li>
              <li className='item'><a href='#'>Liên hệ</a></li>
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
                <li className='item'><a href='#'>VIA FACEBOOK</a></li>
                <li className='item'><a href='#'>CLONE FACEBOOK</a></li>
                <li className='item'><a href='#'>BM & FANPAGE</a></li>
                <li className='item'><a href='#'>KHÓA HỌC</a></li>
                <li className='header-devider'></li>
                <li className='item'><div className='item-button'><a href='#'><span>APP TĂNG LIKE, CMT, SUB</span></a></div></li>
              </ul>
            </div>
            <div className="header-main_right">
              <ul>
                  <li className='item'><div className='signin-signup'><a>ĐĂNG NHẬP / ĐĂNG KÝ</a></div></li>
                  <li className='header-devider'></li>
                  <li className='item'><div className='notify'><Icon type="bell" theme="filled" style={{ fontSize: '20px', width: '20px', height: '20px'}} /></div></li>
                </ul>
            </div>
        </div>
      </div>
      <div className='header-divider'><div className='top-divider'></div></div>
    </Header>
  );
}

export default HeaderLayout;
