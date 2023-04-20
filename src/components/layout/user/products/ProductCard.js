import React from 'react';
import { Card, Button, Row, Col, Badge } from 'antd';

const ProductCard = () => {
    return (
        <Card className='product-card'>
            <Badge className='badge-discount' count={'-51%'}/>
            <Row className='card-container'>
                <Col className='card-image' span={12} ><img alt='product' src={require('../../../../assets/img/product-img.png')} /></Col>
                <Col className='card-content' span={12} ><div className='product-content'>
                    <p className='product-name'>Product Name</p>
                    <p className='product-instock'>Có sẵn: 7 sản phẩm</p>
                </div>
                    <div className='product-price'>
                        <span className='basis-price discounted'>200,000 ₫</span>
                        <span className='discount-price'>99,000 ₫</span>
                    </div>
                    <div className='add-to-card-button'><Button>Mua ngay</Button></div></Col>
            </Row>
        </Card>
    );
};
export default ProductCard;
