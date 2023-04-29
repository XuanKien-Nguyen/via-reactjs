import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Card, Button, Icon, Input, Badge, message} from 'antd';
import Modal from "antd/es/modal";
import {createPurchase} from "../../../../services/purchases";
import {LayoutContext} from "../../../../contexts";

const ProductCard = ({ productDetail }) => {

    const {forceRender} = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [showImgProduct, setShowImgProduct] = useState(false)

    const [pending, setPending] = useState(false)

    const [quantity, setQuantity] = useState(1)

    const [errorText, setErrorText] = useState('')

    const onChangeQuantity = (e) => {
        const value = e.target.value
        if (value < 1) {
            setQuantity(1)
        }else if (value > productDetail.sum_via) {
            setQuantity(productDetail.sum_via)
        } else {
            setQuantity(value)
        }
    }

    useEffect(() => {
        setQuantity(1)
        setErrorText('')
    }, [visible])

    const handlePurchase = () => {
        setErrorText('')
        if (quantity < 1 && quantity > productDetail.sum_via) {
            message.error("Số lượng mua không hợp lệ")
            return
        }
        setPending(true)
        createPurchase({
            category_id: productDetail.id,
            amount: quantity
        }).then(resp => {
            if (resp.status === 200) {
                message.success(resp?.data?.message || 'Mua hàng thành công')
                productDetail.sum_via-=quantity
                forceRender()
            }
            setVisible(false)
        }).catch(err => {
            // console.log(err.response)
            // message.error( err?.response?.data?.message)
            setErrorText(err?.response?.data?.message)
        }).finally(() => setPending(false))
    }

    return (
        <Fragment>
            <Card className='product-card' style={{ width: 'auto' }}>
                <div className='product-header'>
                    <div className='product-title'><span>{productDetail.name}</span></div>
                </div>
                <div className='product-container'>
                    <div className='product-detail'>
                        <div className='product-price'>{productDetail?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </div>
                        <div className='product-quantity'>Còn: <span>{productDetail.sum_via}</span></div>
                        <div className='product-sold'>Đã bán: <span>{productDetail.sold_via}</span></div>
                        <div className='product-more-info'>
                            <div className='info location'><div className='field-title'><Icon type="check" />Quốc gia</div><div className='field-value'>
                                <img width={'25px'} src={productDetail.location_img_url} alt="" className="src"/></div></div>
                            <div className='info create-time'><div className='field-title'><Icon type="check" />Ngày lập</div><div className='field-value'>{productDetail.time}</div></div>
                            <div className='info 2fa'><div className='field-title'><Icon type="check" />Xác thực 2FA</div><div className='field-value'>{productDetail.has_2fa === true ? 'Có' : 'Không'}</div></div>
                            <div className='info friend-number'><div className='field-title'><Icon type="check" />Bạn bè</div><div className='field-value'>{productDetail.number_friend}</div></div>
                            <div className='info checkpoint-email'><div className='field-title'><Icon type="check" />Checkpoint Email</div><div className='field-value'>{productDetail.checkpoint_email === true ? 'Có' : 'Không'}</div></div>
                            <div className='info email'><div className='field-title'><Icon type="check" />Email</div><div className='field-value'>{productDetail.has_email === true ? 'Có' : 'Không'}</div></div>
                            <div className='info change-info'><div className='field-title'><Icon type="check" />Change thông tin</div><div className='field-value'>{productDetail.has_change === true ? 'Có' : 'Không'}</div></div>
                            <div className='info back-up'><div className='field-title'><Icon type="check" />Hỗ trợ backup</div><div className='field-value'>{productDetail.has_backup === true ? 'Có' : 'Không'}</div></div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                        <Button type="primary" style={{fontSize: '13px'}} className='shopping-button' onClick={() => setVisible(true)}>
                        <Icon type="shopping-cart" style={{fontSize: '16px'}} />
                            Mua ngay
                        </Button>
                        <Button type="primary" style={{fontSize: '13px'}} className='show-image-button' onClick={() => setShowImgProduct(true)} disabled={!productDetail.image_url}>
                        <Icon type="picture" style={{fontSize: '16px', color: 'white'}} />
                            Xem ảnh
                        </Button>
                    </div>
                </div>
            </Card>
            <Modal
                centered
                closable={false}
                visible={visible}
                maskClosable={false}
                title={[<div key={13131} className={'d-flex'}><img width={'25px'} src={productDetail.location_img_url} alt="" className="src"/><b style={{marginLeft: '10px', fontSize: '20px'}}>{productDetail.name}</b></div>]}
                onOk={() => {}}
                onCancel={() => () => {
                    setVisible(false)
                }}
                footer={[
                    <Button key="back" disabled={pending} onClick={() => {
                        setVisible(false)
                    }}>
                        Hủy
                    </Button>,
                    <Button disabled={productDetail.sum_via === 0} key="submit" type="primary" loading={pending} onClick={handlePurchase}>
                        Mua ngay
                    </Button>
                ]}
            >
                {productDetail.sum_via ?
                <div style={{fontSize: '15px'}}>
                        <p>Số lượng còn: <span style={{
                            backgroundColor: 'rgb(82, 196, 26)',
                            color: 'white',
                            padding: '6px',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            borderRadius: '25px'
                        }}>{productDetail.sum_via - quantity}</span></p>
                        <Input autoFocus addonBefore="Nhập số lượng mua" max={productDetail.sum_via} min={1} addonAfter={`x${productDetail?.price || 0}`} type={'number'} value={quantity} onChange={onChangeQuantity} onPressEnter={() => { }} />
                        <p style={{ marginTop: '10px' }}>Thành tiền: <b style={{ color: 'red' }}>{(productDetail?.price * quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b></p>
                    </div> : <b style={{ color: 'red' }}>Sản phẩm đã hết hàng</b>}
                <b style={{ color: 'red' }}>{errorText}</b>
            </Modal>
            <Modal
                className='product-image__modal'
                width={800}
                centered
                onOk={() => setShowImgProduct(false)}
                onCancel={() => setShowImgProduct(false)}
                visible={showImgProduct}
                footer={null}
            >
                <div><img alt={productDetail.id} src={productDetail.image_url}/></div>
            </Modal>
        </Fragment>
    );
};
export default ProductCard;
