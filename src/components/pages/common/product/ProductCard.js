import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {Card, Button, Icon, Input, Badge, message, Tooltip} from 'antd';
import Modal from "antd/es/modal";
import {createPurchase} from "../../../../services/purchases";
import {LayoutContext} from "../../../../contexts";

import { useTranslation } from 'react-i18next';

const ProductCard = ({ productDetail }) => {

    const { t } = useTranslation()

    const {forceRender} = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [showImgProduct, setShowImgProduct] = useState(false)

    const [showDescProduct, setShowDescProduct] = useState(false)

    const [pending, setPending] = useState(false)

    const [quantity, setQuantity] = useState(1)

    const [errorText, setErrorText] = useState('')

    const history = useHistory()

    const user = useSelector(store => store.user)

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

    const goto = url => history.push(url)

    const showPurchaseModal = () => {
        if (!user) {
            goto('/login');
            return
        }
        setVisible(true)
    }

    const buySuccess = (purchaseId) => {
        return Modal.confirm({
            title: t('product.modal-title'),
            okText: t('product.modal-button-detail'),
            cancelText: t('product.modal-button-close'),
            icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
            centered: true,
            onOk() {
                window.location.href = '/user-info?menu=purchase&id=' + purchaseId
            },
            onCancel() {},
        });
    }

    const handlePurchase = () => {
        setErrorText('')
        if (quantity < 1 && quantity > productDetail.sum_via) {
            message.error(t('product.msg-invalid'))
            return
        }
        setPending(true)
        createPurchase({
            category_id: productDetail.id,
            amount: quantity
        }).then(resp => {
            if (resp.status === 200) {
                message.success(resp?.data?.message || t('product.msg-success'))
                productDetail.sum_via-=quantity
                buySuccess(resp.data.purchaseId)
                forceRender()
            }
            setVisible(false)
        }).catch(err => {
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
                        <div className='product-quantity'>{t('product.remain')}: <span>{productDetail.sum_via}</span></div>
                        <div className='product-sold'>{t('product.sold')}: <span>{productDetail.sold_via}</span></div>
                        <div className='product-more-info'>
                            <div className='info location'><div className='field-title'><Icon type="check" />{t('product.location')}</div><div className='field-value'>
                                <img width={'25px'} src={productDetail.location_img_url} alt="" className="src"/></div></div>
                            <div className='info create-time'><div className='field-title'><Icon type="check" />{t('product.create-time')}</div><div className='field-value'>{productDetail.time}</div></div>
                            <div className='info 2fa'><div className='field-title'><Icon type="check" />{t('product.2fa')}</div><div className='field-value'>{productDetail.has_2fa === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info friend-number'><div className='field-title'><Icon type="check" />{t('product.friend')}</div><div className='field-value'>{productDetail.number_friend}</div></div>
                            <div className='info checkpoint-email'><div className='field-title'><Icon type="check" />{t('product.checkpoint-email')}</div><div className='field-value'>{productDetail.checkpoint_email === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info email'><div className='field-title'><Icon type="check" />{t('product.email')}</div><div className='field-value'>{productDetail.has_email === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info change-info'><div className='field-title'><Icon type="check" />{t('product.change')}</div><div className='field-value'>{productDetail.has_change === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info back-up'><div className='field-title'><Icon type="check" />{t('product.back-up')}</div><div className='field-value'>{productDetail.has_backup === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <Button className='show-image-button' type='primary' onClick={() => setShowImgProduct(true)}><Icon type="picture" style={{fontSize: '16px', color: 'white'}}/></Button>
                            <Button className='show-desc-button' type='primary' onClick={() => setShowDescProduct(true)}><Icon type="search" style={{fontSize: '16px', color: 'white'}}/></Button>
                        </div>
                        <Button type="primary" style={{fontSize: '13px'}} className='shopping-button' onClick={showPurchaseModal}>
                        <Icon type="shopping-cart" style={{fontSize: '16px'}} />
                            {t('product.button-buy')}
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
                        {t('product.button-cancel')}
                    </Button>,
                    <Button disabled={productDetail.sum_via === 0} key="submit" type="primary" loading={pending} onClick={handlePurchase}>
                        {t('product.button-buy')}
                    </Button>
                ]}
            >
                {productDetail.sum_via ?
                <div style={{fontSize: '15px'}}>
                        <p>{t('product.remain-modal')}: <span style={{
                            backgroundColor: 'rgb(82, 196, 26)',
                            color: 'white',
                            padding: '6px',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            borderRadius: '25px'
                        }}>{productDetail.sum_via}</span></p>
                        <Input autoFocus addonBefore={t('product.enter-value')} max={productDetail.sum_via} min={1} addonAfter={`x${productDetail?.price || 0}`} type={'number'} value={quantity} onChange={onChangeQuantity} onPressEnter={() => { }} />
                        <p style={{ marginTop: '10px' }}>{t('product.total')}: <b style={{ color: 'red' }}>{(productDetail?.price * quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b></p>
                    </div> : <b style={{ color: 'red' }}>{t('product.out-of-stock')}</b>}
                <b style={{ color: 'red' }}>{errorText}</b>
            </Modal>
            <Modal
                className='product-image__modal'
                width={'auto'}
                centered
                onOk={() => setShowImgProduct(false)}
                onCancel={() => setShowImgProduct(false)}
                visible={showImgProduct}
                footer={null}
            >
                <div style={{textAlign: 'center'}}>{productDetail.image_url ? <img alt={productDetail.id} src={productDetail.image_url}/> : <Icon type="picture" style={{fontSize: '64px', opacity: '0.4'}}/>}</div>
            </Modal>
            <Modal
                className='product-desc__modal'
                width={'auto'}
                centered
                onOk={() => setShowDescProduct(false)}
                onCancel={() => setShowDescProduct(false)}
                visible={showDescProduct}
                footer={null}
                title={t('product.modal-desc')}
            >
                <div><span>{productDetail.description}</span></div>
            </Modal>
        </Fragment>
    );
};
export default ProductCard;
