import React from 'react';
import { Layout, Row, Col, Icon } from 'antd';

const { Footer } = Layout;

function FooterLayout() {
  return (
    <Footer id='footer_user' style={{ backgroundColor: 'rgb(56, 88, 152)', height: 'auto', padding: 0, margin: 0 }}>
      <section className='footer-session'>
        <div className='footer-content'>
          <div style={{borderBottom: '2px solid white'}}>
            <Row gutter={[30, 0]}>
              <Col span={8}><h2>VỀ CHÚNG TÔI</h2><div><ul className='dot'><li>Item</li><li>Item</li><li>Item</li></ul></div></Col>
              <Col span={16}>
                <Row gutter={[20, 0]}>
                  <Col span={8}><h3>Item List</h3><div><ul className='bullet-arrow'><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li></ul></div></Col>
                  <Col span={8}><h3>Item List</h3><div><ul className='bullet-arrow'><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li></ul></div></Col>
                  <Col span={8}><h3>Item List</h3><div><ul className='bullet-arrow'><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li><li><Icon type="right" />Item</li></ul></div></Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={12}><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>© 2023 VIAADS.VN</div></Col>
              <Col span={12}><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}><a>ĐIỀU KHOẢN</a><a>BẢO MẬT</a></div></Col>
            </Row>
          </div>
        </div>
      </section>
      <div className='footer-copyright'><div className='copyright-text'>Chúng tôi không chịu trách nhiệm cho bất kì hành vi sử dụng tài nguyên sai mục đích như lừa đảo chiếm đoạt tài sản, chống phá nhà nước, vi phạm pháp luật . Chúng tôi có lưu trữ thông tin để cung cấp cho cơ quan điều tra.</div></div>
    </Footer>
  );
}

export default FooterLayout;