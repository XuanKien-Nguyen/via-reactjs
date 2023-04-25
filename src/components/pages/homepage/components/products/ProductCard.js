import React from 'react';
import { Card, Button, Icon} from 'antd';

const ProductCard = ({ productDetail }) => {
    return (
        <Card className='product-card' style={{ width: 'auto' }}>
                <div className='product-image'><img alt="product" src={require('../../../../../assets/img/product-img.png')} /></div>
                
                <div className='product-container'>
                    <div className='product-title'><span>Name Product So Longggggggggggggggggggggggggggggggggggggggg</span></div>
                    <div className='product-detail'>
                        <div className='product-price'>19000 VNĐ</div>
                        <div className='product-quantity'>Còn: <span>1999</span></div>
                        <div className='product-more-info'>
                            <div className='info location'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                            <div className='info create-time'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                            <div className='info 2fa'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                            <div className='info friend-number'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                            <div className='info change-info'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                            <div className='info back-up'><div className='field-title'><Icon type="check" />Title</div><div className='field-value'>Việt Nam</div></div>
                        </div>
                    </div>
                    <Button type="primary" style={{fontSize: '13px'}} className='shopping-button'>
                    <Icon type="shopping-cart" style={{fontSize: '16px'}} />
                        Mua ngay
                    </Button>
                </div>
        </Card>
    );
};
export default ProductCard;
