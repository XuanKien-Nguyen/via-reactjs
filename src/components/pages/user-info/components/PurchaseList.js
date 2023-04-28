import React, {useEffect, useState, Fragment} from "react";
import {Badge, message, Table, Button, Input} from "antd";
import {purchaseList} from "../../../../services/purchases";
import Modal from "antd/es/modal";

export default ({loading}) => {

    const [ds, setDs] = useState([])

    const [visible, setVisible] = useState(false)

     const [productDetail, setProductDetail] = useState(null)

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
                console.log(row);
                return <div>
                    <b>{row.total_amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</b> cho {row.quantity} mục
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
    return <Fragment>
        <Table dataSource={ds} columns={columns} rowKey="id" />
        {productDetail && <Modal
            width={'80vw'}
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
        </Modal>}
    </Fragment>

}