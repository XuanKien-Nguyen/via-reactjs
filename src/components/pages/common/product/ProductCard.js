import React from 'react';
import { Card, Button, Icon } from 'antd';

const ProductCard = ({ productDetail }) => {
    return (
        <Card className='product-card' style={{ width: 'auto' }}>
            <div className='product-header'>
                <div className='product-title'><span>{productDetail.name}</span></div>
            </div>
            <div className='product-container'>
                <div className='product-detail'>
                    <div className='product-image'><Icon type="picture" style={{fontSize: '32px', color: 'white'}} onClick={() => {console.log('click');}}/></div>
                    <div className='product-price'>{productDetail?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </div>
                    <div className='product-quantity'>Còn: <span>{productDetail.sum_via}</span></div>
                    <div className='product-sold'>Đã bán: <span>{productDetail.sold_via}1</span></div>
                    <div className='product-more-info'>
                        <div className='info location'><div className='field-title'><Icon type="check" />Quốc gia</div><div className='field-value'>
                            <img width={'25px'} src={productDetail.location_img_url} alt="" className="src" /></div></div>
                        <div className='info create-time'><div className='field-title'><Icon type="check" />Ngày lập</div><div className='field-value'>{productDetail.time}</div></div>
                        <div className='info 2fa'><div className='field-title'><Icon type="check" />Xác thực 2FA</div><div className='field-value'>{productDetail.has_2fa === true ? 'Có' : 'Không'}</div></div>
                        <div className='info friend-number'><div className='field-title'><Icon type="check" />Bạn bè</div><div className='field-value'>{productDetail.number_friend}</div></div>
                        <div className='info checkpoint-email'><div className='field-title'><Icon type="check" />Checkpoint Email</div><div className='field-value'>{productDetail.checkpoint_email === true ? 'Có' : 'Không'}</div></div>
                        <div className='info email'><div className='field-title'><Icon type="check" />Email</div><div className='field-value'>{productDetail.has_email === true ? 'Có' : 'Không'}</div></div>
                        <div className='info change-info'><div className='field-title'><Icon type="check" />Change thông tin</div><div className='field-value'>{productDetail.has_change === true ? 'Có' : 'Không'}</div></div>
                        <div className='info back-up'><div className='field-title'><Icon type="check" />Hỗ trợ backup</div><div className='field-value'>{productDetail.has_backup === true ? 'Có' : 'Không'}</div></div>
                    </div>
                </div>
                <Button type="primary" style={{ fontSize: '13px' }} className='shopping-button'>
                    <Icon type="shopping-cart" style={{ fontSize: '16px' }} />
                    Mua ngay
                </Button>
            </div>
        </Card>
    );
};
export default ProductCard;
