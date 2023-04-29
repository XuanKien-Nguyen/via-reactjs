import React, {useEffect, useState, Fragment} from "react";
import {Badge, message, Table, Button, Input} from "antd";
import {purchaseList, downloadPurchase} from "../../../../services/purchases";
import Modal from "antd/es/modal";
import {convertCurrencyVN, textToFile} from '../../../../utils/helpers'

export default ({loading}) => {

    const [ds, setDs] = useState([])

    const [visible, setVisible] = useState(false)

     const [productDetail, setProductDetail] = useState(null)

    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        loading(true)
        purchaseList().then(resp => {
            if (resp.status === 200) {
                setDs(resp?.data?.newPurchaseList || [])
            }
        }).catch(() => message.error('Có lỗi xảy ra khi lấy thông tin đơn hàng'))
            .finally(() => loading(false))
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => `#${id}`,
            align: 'center'
        },
        {
            title: 'Ngày',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            align: 'center',
            render: status => {
                return <Badge count={status === 'valid' ? 'Bảo hành' : 'Hết bảo hành'}
                              style={{ backgroundColor: status === 'valid' ? '#1890ff' : '#ff4d4f', color: 'white', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
                />
            }
        },
        {
            title: 'Tổng',
            render: row => {
                return <div>
                    <b>{convertCurrencyVN(row.total_amount)}</b> cho {row.quantity} mục
                </div>
            }
        },
        {
            title: 'Thao tác',
            render: row => {
                const showDetail = () => {
                    setProductDetail(row)
                    setVisible(true)
                }
                return <div>
                    <Button onClick={showDetail}>Xem chi tiết</Button>
                </div>
            }
        }
    ];

    const handleDownload = () => {
        setDownloading(true)
        downloadPurchase(productDetail.id).then(resp => {
            console.log(resp);
            const {data} = resp
            message.success(data.message)
            const content = data.purchaseDownloadList.join('\n');
            textToFile(productDetail.category_name, content)
        }).catch(err => {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi tải xuống')
        }).finally(() => setDownloading(false))
    }

    const purchaseDetail = () => {
        const columns = [
            {
                title: 'SẢN PHẨM',
                render: row => {
                    if (row.key === 'category_name') {
                        return <span>{productDetail.category_name} <Badge count={`x${productDetail.quantity}`}></Badge></span>
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

        const dataSource = [
            {
                key: 'category_name',
                title: 'category_name',
                value: convertCurrencyVN(productDetail.total_amount)
            },
            {
                title: 'Tổng số phụ:',
                value: convertCurrencyVN(productDetail.price)
            },
            {
                title: 'Giảm giá:',
                value: convertCurrencyVN(productDetail.amount_of_buyer_spend)
            },
            {
                title: 'Phương thức thanh toán: ',
                value: productDetail.purchase_type
            },
            {
                title: 'Funds used',
                value: '???'
            },
            {
                title: 'Tổng cộng',
                value: convertCurrencyVN(productDetail.total_amount)
            }
        ]

        return <div>
            <Table dataSource={dataSource} columns={columns} rowKey="title" pagination={false} />
            <p align={'center'} style={{marginTop: '10px'}}>
                <Button loading={downloading} onClick={handleDownload}>Tải xuống</Button>
            </p>
            {/*<div style={{backgroundColor: 'red'}}>hello</div>*/}
        </div>
    }

    return <Fragment>
        <Table dataSource={ds} columns={columns} rowKey="id" />
        {productDetail && <Modal
            width={'60vw'}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={'Chi tiết đơn hàng'}
            onOk={() => {}}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    Đóng
                </Button>
            ]}
        >
            <p>Đơn hàng <b>#{productDetail.id}</b> đã được đặt lúc {productDetail.created_time} và hiện tại là <Badge count={productDetail.status === 'valid' ? 'Bảo hành' : 'Hết bảo hành'}
                                                                                                               style={{ backgroundColor: productDetail.status === 'valid' ? '#1890ff' : '#ff4d4f', color: 'white', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
            />
            </p>
            {purchaseDetail()}
        </Modal>}
    </Fragment>

}