import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {Card, Button, Icon, Input, Badge, message, Tooltip} from 'antd';
import Modal from "antd/es/modal";
import {createPurchase} from "../../../../services/purchases";
import {LayoutContext} from "../../../../contexts";
import {getWindowDimensions} from '../../../../utils/helpers';

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
        // if (value < 1) {
        //     setQuantity(1)
        // }else
            if (value > productDetail.sum_via) {
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
            title: t('product.modal_title'),
            okText: t('product.modal_button_detail'),
            cancelText: t('product.modal_button_close'),
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
            message.error(t('message.invalid_purchase'))
            return
        }
        setPending(true)
        createPurchase({
            category_id: productDetail.id,
            amount: quantity
        }).then(resp => {
            if (resp.status === 200) {
                message.success(resp?.data?.message || t('message.success_purchase'))
                productDetail.sum_via-=quantity
                buySuccess(resp.data.purchaseId)
                forceRender()
            }
            setVisible(false)
        }).catch(err => {
            setErrorText(err?.response?.data?.message)
        }).finally(() => setPending(false))
    }

    useEffect(() => {
        const elList = document.getElementsByClassName('product-more-info')
        const iconList = document.getElementsByClassName('toggle-icon')
        const fn = () => {
            const currentWidth = getWindowDimensions().width
            if (currentWidth < 500) {
                Array.from(elList).forEach(el => {
                    el.classList.remove('expand')
                    el.classList.add('collapse')
                });
                Array.from(iconList).forEach(el => {
                    el.classList.remove('expand')
                });
            } else {
                Array.from(elList).forEach(el => {
                    el.classList.remove('collapse')
                    el.classList.add('expand')
                });
            }
        }
        fn()
        window.addEventListener('resize', fn);
        return () => {
            window.removeEventListener("resize", fn)
        }
    }, [])


    const onCollapseDetail = (id) => {
        const el = document.querySelector(`#product-${id} .product-more-info`)
        const iconCollapse = document.querySelector(`#product-${id} .toggle-icon`)
        if (el.classList.contains('expand')) {
            el.classList.remove('expand')
            el.classList.add('collapse')
        } else if (el.classList.contains('collapse')) {
            el.classList.remove('collapse')
            el.classList.add('expand')
        }
        iconCollapse.classList.toggle('expand')
    }

    return (
        <Fragment>
            <Card className='product-card' id={`product-${productDetail.id}`} style={{ width: 'auto' }}>
                <div className='product-header'>
                    <div className='product-title'><span>{productDetail.name}</span></div>
                </div>
                <div className='product-container'>
                    <div className='product-detail'>
                        <div className='product-price'>{productDetail?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </div>
                        <div className='product-quantity'>{t('product.remain')}: <span>{productDetail.sum_via}</span></div>
                        <div className='product-sold'>{t('product.sold')}: <span>{productDetail.sold_via}</span></div>
                        <div className='toggle_product-more-info' style={{cursor: 'pointer'}} onClick={() => {
                            onCollapseDetail(productDetail.id)
                        }}><a style={{textDecoration: 'underline'}}>{t('product.view_detail')}</a> <Icon type="caret-down" style={{color: "#1b74e4"}} className="toggle-icon" /></div>
                        <div className='product-more-info expand'>
                            <div className='info location'><div className='field-title'><Icon type="check" />{t('product.location')}</div><div className='field-value' style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                <img width={'25px'} height={'25px'} src={productDetail.location_img_url} alt="" className="src"/><span>{productDetail.location}</span></div></div>
                            <div className='info create-time'><div className='field-title'><Icon type="check" />{t('product.create_time')}</div><div className='field-value'>{productDetail.time}</div></div>
                            <div className='info 2fa'><div className='field-title'><Icon type="check" />{t('product.2fa')}</div><div className='field-value'>{productDetail.has_2fa === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info friend-number'><div className='field-title'><Icon type="check" />{t('product.friend')}</div><div className='field-value'>{productDetail.number_friend}</div></div>
                            <div className='info checkpoint-email'><div className='field-title'><Icon type="check" />{t('product.checkpoint_email')}</div><div className='field-value'>{productDetail.checkpoint_email === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info email'><div className='field-title'><Icon type="check" />{t('product.email')}</div><div className='field-value'>{productDetail.has_email === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info change-info'><div className='field-title'><Icon type="check" />{t('product.change')}</div><div className='field-value'>{productDetail.has_change === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                            <div className='info back-up'><div className='field-title'><Icon type="check" />{t('product.back_up')}</div><div className='field-value'>{productDetail.has_backup === true ? `${t('common.yes')}` : `${t('common.no')}`}</div></div>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <Button className='show-image-button' type='primary' onClick={() => setShowImgProduct(true)}><Icon type="picture" style={{fontSize: '16px', color: 'white'}}/></Button>
                            <Button className='show-desc-button' type='primary' onClick={() => setShowDescProduct(true)}><Icon type="search" style={{fontSize: '16px', color: 'white'}}/></Button>
                        </div>
                        <Button type="primary" style={{fontSize: '13px'}} className='shopping-button' onClick={showPurchaseModal}>
                        <Icon type="shopping-cart" style={{fontSize: '16px'}} />
                            {t('product.button_buy')}
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
                        {t('product.button_cancel')}
                    </Button>,
                    <Button disabled={productDetail.sum_via === 0} key="submit" type="primary" loading={pending} onClick={handlePurchase}>
                        {t('product.button_buy')}
                    </Button>
                ]}
            >
                {productDetail.sum_via ?
                <div style={{fontSize: '15px'}}>
                        <p>{t('product.remain_modal')}: <span style={{
                            backgroundColor: 'rgb(82, 196, 26)',
                            color: 'white',
                            padding: '6px',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            borderRadius: '25px'
                        }}>{productDetail.sum_via}</span></p>
                        <Input autoFocus addonBefore={t('product.enter_value')} max={productDetail.sum_via} addonAfter={`x${productDetail?.price || 0}`} value={quantity} onChange={onChangeQuantity} onPressEnter={() => { }} />
                        <p style={{ marginTop: '10px' }}>{t('product.total')}: <b style={{ color: 'red' }}>{(productDetail?.price * quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b></p>
                    </div> : <b style={{ color: 'red' }}>{t('product.out_of_stock')}</b>}
                <b style={{ color: 'red' }}>{errorText}</b>
            </Modal>
            <Modal
                className='product-image__modal'
                width={'1380px'}
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
                title={t('product.modal_desc')}
            >
                <div><span>{productDetail.description}</span></div>
            </Modal>
        </Fragment>
    );
};
export default ProductCard;
