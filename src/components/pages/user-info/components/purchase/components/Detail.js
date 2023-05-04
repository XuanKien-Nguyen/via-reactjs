import React, {useEffect, useState, Fragment, useContext} from "react";
import {createPurchase, downloadPurchase, purchaseDetail, purchaseList} from "../../../../../../services/purchases";
import {message, Badge, Table, Button, Tag, Input} from "antd";

import {convertCurrencyVN, textToFile} from "../../../../../../utils/helpers";
import {useHistory} from "react-router-dom";
import Modal from "antd/es/modal";
import {LayoutContext} from "../../../../../../contexts";

export default ({id, loading}) => {

    const history = useHistory()

    const [productDetail, setProductDetail] = useState({})

    const {forceRender} = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [pending, setPending] = useState(false)

    const [quantity, setQuantity] = useState(1)

    const [errorText, setErrorText] = useState('')

    const columns = [
        {
            title: 'SẢN PHẨM',
            render: row => {
                if (row.key === 'category_name') {
                    return <span>{productDetail?.content} <Badge count={`x${productDetail.quantity}`}></Badge></span>
                } else {
                    return <b>{row.title}</b>
                }
            }
        },
        {
            title: 'TỔNG',
            // dataIndex: 'value',
            render: row => <b>{row.value}</b>,
            align: 'right'
        },
    ]

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id])

    const columnSP = [
        {
            title: 'SẢN PHẨM',
            dataIndex: 'name',
            width: '30%'
        },
        {
            title: 'TÀI KHOẢN - MÃ',
            dataIndex: 'account',
            width: '70%'
        }
    ]

    const getDsSP = () => {
        return productDetail.product_recycle_bins.map(el => ({
            name: productDetail.content,
            account: el.productDetail
        }))
    }

    const dataSource = [
        {
            key: 'category_name',
            title: 'category_name',
            value: convertCurrencyVN(productDetail.total_amount)
        },
        {
            title: 'Nội dung:',
            value: convertCurrencyVN(productDetail.content)
        },
        {
            title: 'Tiền khuyến mãi đã sử dụng:',
            value: convertCurrencyVN(productDetail.bonus_of_buyer_spend)
        },
        {
            title: 'Phương thức thanh toán: ',
            value: productDetail.purchase_type === 'direct' ? 'Trực tiếp' : 'Cộng tác viên'
        }
    ]

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


    const handleDownload = (id, categoryName) => {
        loading(true)
        downloadPurchase(id).then(resp => {
            const {data} = resp
            message.success(data.message)
            const content = data.purchaseDownloadList.join('\n');
            textToFile(categoryName, content)
        }).catch(err => {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải xuống')
        }).finally(() => loading(false))
    }

    useEffect(() => {
        loading(true)
        purchaseList({id}).then(resp => {
            if (resp.status === 200) {
                const data = resp.data
                if (data && data.newPurchaseList) {
                    setProductDetail(data.newPurchaseList[0])
                    console.log(data.newPurchaseList[0]);
                }
            }
        }).catch(err => message.error(err)).finally(() => loading(false))
    }, [])

    const buy = () => {
        return <Modal
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
    }

    return <div>
        <Button style={{marginBottom: '10px'}} onClick={() => history.push({search: `menu=purchase`})}>Quay lại</Button>
        {productDetail.id ? <Fragment>
            <br/>
            <b>Đơn hàng <span style={{color: 'red'}}>#{productDetail.id}</span> đã được đặt lúc {productDetail.created_time} và hiện tại là
                <Tag color={productDetail.status === 'valid' ? '#87d068' : '#f50'}>{productDetail.status === 'valid' ? 'Bảo hành' : 'Hết bảo hành'}</Tag>
            </b>
            <Table dataSource={dataSource} columns={columns} rowKey="title" pagination={false} />
            <p align={'center'} style={{marginTop: '10px'}}>
                <Button type='primary' className={'m-r-5'} onClick={() => setVisible(true)}>Đặt lại hàng</Button>
                <Button type='danger' onClick={() => handleDownload(productDetail.id, productDetail.category_name)}>Tải xuống</Button>
            </p>
            <b>SẢN PHẨM</b>
            <br/>
            <Tag color="geekblue" style={{margin: '10px 0px'}}>Định dạng: <span style={{color: 'red'}}>{productDetail.category_format}</span></Tag>
            {/*<b>Định dạng: </b>*/}
            <Table bordered dataSource={getDsSP()} columns={columnSP} pagination={false}/>
            {buy()}
        </Fragment> : <p>Không tìm thấy chi tiết đơn hàng</p>}
    </div>
}