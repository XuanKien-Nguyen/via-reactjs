import React from 'react';
import { Card, Button, Row, Col, Badge } from 'antd';

const ProductCard = () => {
    return (
        <Card className='product-card'>
            <Badge className='badge-discount' count={'-51%'}/>
            <Row className='card-container'>
                <Col className='card-image' span={12} ><img alt='product' src={require('../../../../assets/img/product-img.png')} /></Col>
                <Col className='card-content' span={12} ><div className='product-content'>
                    <div className='product-name'><a>Product Name Very Longggggggggggggggggggggggggggggggggggggggggggggggggggggggg asssssssssssssssssssssssssssssssssssssssssssss assssssssss asssssssssss asssssssssssssssss assssssssss</a></div>
                    <div className='product-quality instock'><p >Có sẵn: 7 sản phẩm</p></div>
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
