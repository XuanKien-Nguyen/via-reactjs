import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import RechargePendingDetail from "./components/Detail";
import { getAllRechargePending, getStatusListRechargePending, getTypeListRechargePending, deleteRechargePendingById } from "../../../services/recharge-manager";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import { Button, Icon, Tooltip, Tag, Spin } from "antd";
import Modal from "antd/es/modal";
import { useTranslation } from "react-i18next";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};
const MAP_STATUS = {};

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}


export default () => {

    const {t} = useTranslation()

    const user = useSelector(store => store.user)

    const {setLoading} = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [ds, setDs] = useState([])
    const [rechargeTicketId, setRechargeTicketId] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [statusList, setStatusList] = useState([])
    const [typeList, setTypeList] = useState([])
    const [createdDate, setCreatedDate] = useState([])
    const [lastestDecicedBy, setLastestDecicedBy] = useState('')
    const [lastestDecicedDate, setLastestDecicedDate] = useState([])

    const [rechargePendingDetail, setRechargePendingDetail] = useState(null)
    const [initDetail, setInitDetail] = useState(false)

    const [totalAmount, setTotalAmount] = useState(0)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getTypeListRechargePending().then(resp => {
            const data = resp.data?.TYPE_OBJ || [];
            const lstType = [{label: 'recharge_type.ALL', value: ''}]
            for (const key of Object.keys(data)) {
                lstType.push({
                    label: `recharge_type.${key}`,
                    value: data[key],
                })
                MAP_TYPE[data[key]] = `recharge_type.${key}`
            }
            setTypeList(lstType)
        })
        getStatusListRechargePending().then(resp => {
            const data = resp.data?.STATUS_OBJ || []
            const lstStatus = [{label: 'recharge_tickets_status.ALL', value: ''}]
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: `recharge_tickets_status.${key}`,
                    value: data[key]
                })
                MAP_STATUS[data[key]] = `recharge_tickets_status.${key}`
            }
            setStatusList(lstStatus)
        })
    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (!visible) {
                setRechargePendingDetail(null)
            }
        }, 200)
    }, [visible])

    const getTypeList = () => {
        return typeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getStatusList = () => {
        return statusList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={transactionId}
                setValue={setTransactionId}
                type={'text'}
                title={'Mã giao dịch'}
                allowClear={true} />,
            <FilterItem defaultValue={content}
                setValue={setContent}
                type={'text'}
                title={'Nội dung'}
                allowClear={true} />,
            <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                title={'Loại'} />,
            <FilterItem defaultValue={status} setValue={setStatus} options={getStatusList()} type={'select'}
                title={'Trạng thái'} />,
            <FilterItem defaultValue={rechargeTicketId}
                setValue={setRechargeTicketId}
                type={'text'}
                title={'Mã ticket nạp lỗi'}
                allowClear={true} />,
            <FilterItem defaultValue={lastestDecicedBy}
                setValue={setLastestDecicedBy}
                type={'text'}
                title={'Người quyết định'}
                allowClear={true} />,
            <FilterItem defaultValue={createdDate} setValue={setCreatedDate} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày tạo'} />,
            <FilterItem defaultValue={lastestDecicedDate} setValue={setLastestDecicedDate} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày quyết định'} />,
        ]
    }

    const setupSearch = () => {
        let created_time = ''
        let latest_decided_time = ''
        if (createdDate.length > 0) {
            created_time = JSON.stringify(createdDate?.map(el => el?.format(dateFormat)))
        }
        if (lastestDecicedDate.length > 0) {
            latest_decided_time = JSON.stringify(lastestDecicedDate?.map(el => el?.format(dateFormat)))
        }
        const params = {
            recharge_ticket_id: rechargeTicketId,
            transaction_id: transactionId,
            type,
            status,
            content,
            latest_decidedby: lastestDecicedBy,
            created_time,
            latest_decided_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getAllRechargePending(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.pendingRechargeList || [])
                    setPage({
                        total: resp.data.totalPendingRecharge,
                        perpage: resp.data.pendingRechargePerPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                    setTotalAmount(resp.data.pendingRechargeAmount)
                }
            },
            reject: (err) => console.log(err)
        }
    }


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

    const handleDelete = ticket => {
        Modal.confirm({
            content: <p>Bạn có chắc chắn muốn xoá Ticket <b>#{ticket.id}</b>?</p>,
            width: '500px',
            cancelText: 'Huỷ',
            okText: 'Xoá',
            okButtonProps: {
                type: 'danger'
            },
            onOk: () => {
                deleteRechargePendingById(ticket.id).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            width: '400px',
                            content: resp?.data?.message,
                            onOk: () => {}
                        })
                    }
                }).catch(err => Modal.error({
                    width: '700px',
                    content: err?.response?.data?.message,
                    onOk: () => {
                    }
                })).finally(() => {setReload(reload + 1)})
            },
            onCancel: () => {
            }
        })
    }


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '150px',
            render: id => <b>#{id}</b>,
            align: 'center',
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'transaction_id',
            width: '250px',
            render: transaction_id => transaction_id ? <b>{transaction_id}</b> : '-',
            align: 'center'
        },
        {
            title: 'Nội dung',
            width: '300px',
            dataIndex: 'content',
            align: 'center'
        },
        {
            title: 'Mã ticket nạp lỗi',
            dataIndex: 'recharge_ticket_id',
            width: '150px',
            render: recharge_ticket_id => recharge_ticket_id ? <b>{recharge_ticket_id}</b> : '-',
            align: 'center'
        },
        {
            title: 'Tiền tài khoản',
            width: '200px',
            dataIndex: 'amount',
            align: 'center',
            render: v => <b style={{color: 'red'}}>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tiền USDT',
            width: '200px',
            dataIndex: 'usdt_amount',
            align: 'center',
            render: v => v ? v : '-',
        },
        {
            title: 'USDT/VND',
            width: '200px',
            dataIndex: 'rate',
            align: 'center',
            render: v => v ? v : '-',
        },
        {
            title: 'Loại',
            width: '150px',
            dataIndex: 'type',
            align: 'center',
            render: type => <Tag color={type === 'banking' ? 'blue' : 'grey'}>{t(MAP_TYPE[type])}</Tag>
        },
        {
            title: 'Trạng thái',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={STATUS_COLOR[status]}>{t(MAP_STATUS[status])}</Tag>
        },
        {
            title: 'Thời gian tạo',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Người quyết định',
            width: '200px',
            dataIndex: 'latest_decidedby',
            align: 'center'
        },
        {
            title: 'Thời gian quyết định',
            width: '200px',
            dataIndex: 'latest_decided_time',
            align: 'center'
        },
        {
            title: 'Thao tác',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title='Chi tiết'>
                        <Button type='primary' style={{marginRight: '8px'}} onClick={() => {
                            setRechargePendingDetail(row)
                            setVisible(true)
                        }}><Icon type="file-search" /></Button>
                        <Button type='danger' onClick={() => {
                            handleDelete(row)
                        }}><Icon type="delete" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ]

    return <div>
        {user && <Fragment>
            <Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[rechargeTicketId, transactionId, content, type, status, lastestDecicedBy, createdDate, lastestDecicedDate]}
            onReset={() => {
                setRechargeTicketId('')
                setTransactionId('')
                setType('')
                setStatus('')
                setContent('')
                setLastestDecicedBy('')
                setCreatedDate([])
                setLastestDecicedDate([])
            }}
            page={page} />
            <div style={{marginBottom: '8px', fontWeight: 'bold'}}>
                <div>Tổng tiền tài khoản nạp lỗi: <span style={{color: 'red'}}>{convertCurrencyVN(totalAmount)}</span></div>
            </div>
            <TableCommon
                className='table-order'
                bordered={true}
                page={page}
                datasource={ds}
                columns={columns}
                rowKey="id"
                onChangePage={onChangePage}
                onChangeSize={onChangeSize}
                scroll={{ x: true }}
            />
            {rechargePendingDetail && <Modal
            className={'modal-body-80vh'}
            width={'80%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={'Chi tiết ticket nạp lỗi'}
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
                <RechargePendingDetail id={rechargePendingDetail.id} loading={setInitDetail} mapType={MAP_TYPE} mapStatus={MAP_STATUS}/>
            </Spin>
        </Modal>}
        </Fragment>}
    </div>
}