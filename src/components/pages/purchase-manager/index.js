import React, {Fragment, useContext, useEffect, useState} from "react";
import {Button, Icon, Spin, Tag, Tooltip} from "antd";
import {purchaseList} from "../../../services/purchase-manager";
import {getPurchaseStatus, getPurchaseType} from "../../../services/purchases";
import Modal from "antd/es/modal";
import {convertCurrencyVN} from '../../../utils/helpers'
import Search from './components/Search'
import TableCommon from '../../common/table'
import PurchaseDetail from './components/Detail'
import {useTranslation} from 'react-i18next';
import {LayoutContext} from "../../../contexts";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;


export default () => {

    const {setLoading} = useContext(LayoutContext)

    const {t} = useTranslation()

    const [ds, setDs] = useState([])

    const [visible, setVisible] = useState(false)

    const [productDetail, setProductDetail] = useState(null)
    const [purchaseType, setPurchaseType] = useState([])
    const [purchaseStatus, setPurchaseStatus] = useState([])
    const [initDetail, setInitDetail] = useState(false)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    useEffect(() => {
        setTimeout(() => {
            if (!visible) {
                setProductDetail(null)
            }
        }, 200)
    }, [visible])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '150px',
            render: id => <b>#{id}</b>,
            align: 'center'
        },
        {
            title: 'ID người mua hàng',
            dataIndex: 'user_id',
            width: '150px',
            render: id => <b>#{id}</b>,
            align: 'center'
        },
        {
            title: 'Thời gian mua hàng',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Nội dung',
            width: '500px',
            dataIndex: 'content',
            align: 'center'
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'purchase_type',
            align: 'center',
            width: '200px',
            render: val => val === 'direct' ? 'Trực tiếp' : 'API'
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            align: 'center',
            width: '150px',
            render: status => {
                const r = {
                    color: '#f50',
                    text: 'Hết bảo hành'
                }
                if (status === 'valid') {
                    r.color = '#87d068'
                    r.text = 'Bảo hành'
                }
                return <Tag color={r.color}>{r.text}</Tag>
            }
        },
        {
            title: 'Tổng',
            width: '200px',
            align: 'center',
            render: row => {
                return <div>
                    <b>{convertCurrencyVN(row.total_amount)}</b>
                </div>
            }
        },
        {
            title: 'Thao tác',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title={'Chi tiết'}>
                        <Button type='primary' onClick={() => {
                            setProductDetail(row)
                            setVisible(true)
                        }}><Icon type="file-search"/></Button>
                    </Tooltip>
                    <br/>
                </div>
            }
        },
    ];

    const onChangePage = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: currentPage
        })
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: 1
        })
    }

    useEffect(() => {
        getPurchaseType().then(resp => {
                if (resp.status === 200) {
                    const data = resp.data?.TYPE_OBJ || []
                    const lstType = [{label: 'purchase-type.ALL', value: ''}]
                    for (const key of Object.keys(data)) {
                        lstType.push({
                            label: `purchase-type.${key}`,
                            value: data[key]
                        })
                    }
                    setPurchaseType(lstType)
                }
            }
        )
        getPurchaseStatus().then(resp => {
                if (resp.status === 200) {
                    const data = resp.data?.STATUS_OBJ || []
                    const lstStatus = [{label: 'purchase-status.ALL', value: ''}]
                    for (const key of Object.keys(data)) {
                        lstStatus.push({
                            label: `purchase-status.${key}`,
                            value: data[key]
                        })
                    }
                    setPurchaseStatus(lstStatus)
                }
            }
        )
    }, [])

    const getTypeList = () => {
        return purchaseType.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getStatusList = () => {
        return purchaseStatus.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    return <Fragment>
        <Search setPurchaseList={setDs}
                api={purchaseList}
                loading={setLoading}
                setPageInfo={setPage}
                page={page}
                getTypeList={getTypeList}
                getStatusList={getStatusList}
        />
        <TableCommon
            className='table-order'
            bordered={true}
            page={page}
            datasource={ds}
            columns={columns}
            rowKey="id"
            onChangePage={onChangePage}
            onChangeSize={onChangeSize}
            scroll={{x: true}}
        />
        {productDetail && <Modal
            className={'modal-body-80vh'}
            width={'80vw'}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={'Chi tiết đơn hàng'}
            onOk={() => {
            }}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    Đóng
                </Button>
            ]}
        >
            <Spin spinning={initDetail} indicator={antIcon}>
                <PurchaseDetail id={productDetail.id} loading={setInitDetail}/>
            </Spin>
        </Modal>}
    </Fragment>

}