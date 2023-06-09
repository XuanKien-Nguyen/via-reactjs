import React, {Fragment, useContext, useEffect, useState} from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import RechargeDetail from './components/RechargeDetail'
import {
    exitTicket,
    getAllRechargeTicketsMgr,
    getRechargeTicketsStatusList,
    registerSolveTicket,
    rejectTicket,
    resolveErrorDeposit,
    restoringTicket,
    deleteBulkTicket
} from "../../../services/tickets";
import ListRechargePending from './components/recharge-pending-manager'
import {LayoutContext} from "../../../contexts";
import {convertCurrencyVN} from "../../../utils/helpers";
import {Button, Col, Icon, Input, Modal, Row, Spin, Steps, Tag, Tooltip} from "antd";
import {useTranslation} from "react-i18next";

const {TextArea} = Input
const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}

const {Step} = Steps
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
let currentId = null

export default () => {

    const {t} = useTranslation()

    const {setLoading} = useContext(LayoutContext)

    const [ds, setDs] = useState([])
    const [id, setId] = useState('')
    const [userId, setUserId] = useState('')
    const [status, setStatus] = useState('')
    const [ticketsStatusList, setTicketsStatusList] = useState([])
    const [createdDate, setCreatedDate] = useState([])
    const [createdBy, setCreatedBy] = useState('')
    const [content, setContent] = useState('')
    const [latest_decidedby, set_latest_decidedby] = useState('')
    const [latest_decided_time, set_latest_decided_time] = useState([])

    const [pending, setPending] = useState(false)
    const [visible, setVisible] = useState(false)
    const [currentRow, setCurrentRow] = useState(null)

    const [step, setStep] = useState(0)
    const [initDetail, setInitDetail] = useState(false)
    const [visibleReject, setVisibleReject] = useState(false)
    const [rechargePendingSelected, setRechargePendingSelected] = useState(null)
    const [errorComment, setErrorComment] = useState('')
    const [comment, setComment] = useState('')
    const [reload, setReload] = useState(0)
    const [render, setRerender] = useState(0)

    const [ticketsSelected, setTicketsSelected] = useState([])

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    useEffect(() => {
        getRechargeTicketsStatusList().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.STATUS_OBJ || []
                const lstStatus = [{label: 'recharge_tickets_status.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstStatus.push({
                        label: `recharge_tickets_status.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `recharge_tickets_status.${key}`
                }
                setTicketsStatusList(lstStatus)
            }
        })
    }, [])

    const getTicketsStatusList = () => {
        return ticketsStatusList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={id}
                        setValue={setId}
                        type={'text'}
                        title={'ID'}
                        allowClear={true}/>,
            <FilterItem defaultValue={userId}
                        setValue={setUserId}
                        type={'text'}
                        title={'User ID'}
                        allowClear={true}/>,
            <FilterItem defaultValue={createdBy}
                        setValue={setCreatedBy}
                        type={'text'}
                        title={'Người tạo'}
                        allowClear={true}/>,
            <FilterItem defaultValue={content}
                        setValue={setContent}
                        type={'text'}
                        title={'Nội dung'}
                        allowClear={true}/>,
            <FilterItem defaultValue={status} setValue={setStatus} options={getTicketsStatusList()} type={'select'}
                        title={'Trạng thái'}/>,
            <FilterItem defaultValue={latest_decidedby}
                        setValue={set_latest_decidedby}
                        type={'text'}
                        title={'Người quyết định cuối'}
                        allowClear={true}/>,
            <FilterItem defaultValue={latest_decided_time}
                        setValue={set_latest_decided_time}
                        type={'date'}
                        title={'Thời gian quyết định cuối'}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        allowClear={true}/>,
            <FilterItem defaultValue={createdDate}
                        setValue={setCreatedDate}
                        type={'date'}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        title={'Thời gian tạo'}/>
        ]
    }

    const setupSearch = () => {
        let latest_decided_time_str = ''
        if (latest_decided_time.length > 0) {
            latest_decided_time_str = JSON.stringify(latest_decided_time?.map(el => el?.format(dateFormat)))
        }

        let created_date_str = ''
        if (createdDate.length > 0) {
            created_date_str = JSON.stringify(createdDate?.map(el => el?.format(dateFormat)))
        }
        const params = {
            id,
            user_id: userId,
            latest_decidedby,
            createdby: createdBy,
            content,
            status,
            latest_decided_time: latest_decided_time_str,
            created_time: created_date_str,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getAllRechargeTicketsMgr(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.rechargeTicketList || [])
                    setPage({
                        total: resp.data.totalRechargeTickets,
                        perpage: resp.data.perPage,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                }
                // fix bug vỡ form sau khi reload
                setTimeout(() => {
                    setRerender(render + 1)
                }, 500)
            },
            reject: (err) => console.log(err)
        }
    }

    useEffect(() => {
        if (!visible) {
            setCurrentRow(null)
            setRechargePendingSelected(null)
        } else {
            setLoading(true)
        }
    }, [visible])

    const onShowImage = (url) => {
        Modal.info({
            className: "recharge-tickets-image_modal",
            width: '1180px',
            content: <div><img alt="recharge-tickets" src={url}/></div>,
            maskClosable: true,
        })
    }

    const handleRegisterResolveTicket = row => {
        setLoading(true)
        registerSolveTicket(row.id).then(resp => {
            if (resp.status === 200) {
                setCurrentRow(row)
                setVisible(true)
            }
        }).catch(err => {
            Modal.error({
                content: err?.response?.data?.message
            })
        })
            .finally(() => setLoading(false))
    }


    const handleRejectTicket = () => {
        setInitDetail(true)
        rejectTicket(currentId, {comment}).then(resp => {
            if (resp.status === 200) {
                Modal.success({
                    content: resp?.data?.message
                })
                setReload(reload + 1)
                setComment('')
                setErrorComment('')
                setVisibleReject(false)
            }
        }).catch(err => Modal.error({
            content: err.response?.data?.message
        })).finally(() => setInitDetail(false))
    }

    const handleRestoringTicket = id => {
        Modal.confirm({
            content: 'Bạn có chắc chắn muốn hoàn tác yêu cầu này?',
            okText: 'Hoàn tác',
            cancelText: 'Huỷ bỏ',
            onOk: () => {
                setLoading(true)
                restoringTicket(id).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp?.data?.message
                        })
                        setReload(reload + 1)
                    }
                }).catch(err => Modal.error({
                    content: err.response?.data?.message
                })).finally(() => setLoading(false))
            }
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          setTicketsSelected(selectedRowKeys)
        },
    };

    const onDeleteTickets = (lstSelected) => {
        let body;
        body = {
            recharge_ticket_ids: lstSelected
        }
        Modal.confirm({
            content: 'Bạn có chắc chắn muốn xóa phiếu nạp tiền?',
            okText: 'Xóa',
            cancelText: 'Huỷ bỏ',
            onOk: () => {
                setLoading(true)
                deleteBulkTicket(body).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp?.data?.message
                        })
                        setReload(reload + 1)
                    }
                }).catch(err => Modal.error({
                    content: err.response?.data?.message
                })).finally(() => setLoading(false))
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
            title: 'User ID',
            dataIndex: 'user_id',
            width: '150px',
            render: userId => <b>#{userId}</b>,
            align: 'center'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image_url',
            align: 'center',
            width: '200px',
            render: image_url => <div className="recharge-tickets_image"><img alt="recharge-tickets" src={image_url}/>
                <Icon type='eye' style={{color: 'white', fontSize: '24px'}} onClick={() => {
                    onShowImage(image_url)
                }}/>
            </div>
        },
        {
            title: 'Trạng thái',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={STATUS_COLOR[status]}>{t(MAP_TYPE[status])}</Tag>
        },
        {
            title: 'Nội dung',
            width: '200px',
            dataIndex: 'content',
            align: 'center'
        },
        {
            title: 'Số dư tài khoản',
            width: '200px',
            dataIndex: 'added_amount',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Số dư khuyễn mãi',
            width: '200px',
            dataIndex: 'added_bonus',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Ghi chú',
            width: '200px',
            dataIndex: 'comment',
            align: 'center'
        },
        {
            title: 'Người tạo',
            width: '200px',
            dataIndex: 'createdby',
            align: 'center'
        },
        {
            title: 'Thời gian tạo',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Người quyết định cuối',
            width: '200px',
            dataIndex: 'latest_decidedby',
            align: 'center'
        },
        {
            title: 'Thời gian quyết định cuối',
            width: '200px',
            dataIndex: 'latest_decided_time',
            align: 'center'
        },
        {
            title: 'Thao tác',
            width: '150px',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <Row gutter={5}>
                    <Col sm={12} style={{textAlign: 'right'}}>
                        <Tooltip title={'Đăng ký phê duyệt'}>
                            <Button type={'primary'}
                                // disabled={row.status !== 'pending'}
                                    onClick={() => handleRegisterResolveTicket(row)}>
                                <Icon type="file-done"/>
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col sm={12} style={{
                        textAlign: 'left'
                    }}>
                        <Tooltip title={'Từ chối phê duyệt'}>
                            <Button style={{
                                backgroundColor: '#ffc107',
                                borderColor: '#ffc107',
                                color: 'white'
                            }}
                                    onClick={() => {
                                        currentId = row.id
                                        setVisibleReject(true)
                                    }}
                            >
                                <Icon type="stop"/>
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col sm={12} style={{textAlign: 'right', marginTop: '5px'}}>
                        <Tooltip title={'Hoàn tác phê duyệt'} placement={'bottom'}>
                            <Button
                                // disabled={row.status !== 'done'}
                                style={{
                                    backgroundColor: '#17a2b8',
                                    color: 'white'
                                }}
                                onClick={() => handleRestoringTicket(row.id)}>
                                <Icon type="redo"/>
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col sm={12} style={{textAlign: 'left', marginTop: '5px'}}>
                        <Tooltip title={'Xoá yêu cầu'} placement={'bottom'}>
                            <Button type={'danger'}
                                // disabled={row.status !== 'done'}
                                onClick={() => {onDeleteTickets([row.id])}}
                            >
                                <Icon type="delete"/>
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
            }
        },
    ]

    const isDisableNextStep = () => {
        if (step === 0 && rechargePendingSelected === null) {
            return true
        }
        return false
    }

    return <Fragment>
        <Search items={getItems()}
                search={setupSearch()}
                loading={setLoading}
                setPage={setPage}
                state={[id, userId, latest_decidedby, latest_decided_time, content, createdBy, createdDate, status, reload]}
                onReset={() => {
                    setId('')
                    setUserId('')
                    setStatus('')
                    set_latest_decidedby('')
                    set_latest_decided_time([])
                    setContent('')
                    setCreatedBy('')
                    setCreatedDate([])
                }}
                page={page}/>
        <p style={{textAlign: 'right'}} className={"m-b-10"}>
            <Button type={'danger'} disabled={ticketsSelected.length === 0} onClick={() => onDeleteTickets(ticketsSelected)}>
                <Icon type='delete'/> Xóa phiếu nạp tiền lỗi
            </Button>
        </p>
        <TableCommon
            setPage={setPage}
            className='table-order'
            bordered={true}
            page={page}
            datasource={ds}
            columns={columns}
            rowKey="id"
            scroll={{x: true}}
            rowSelection={rowSelection}
        />
        <Modal
            className={'modal-body-80vh'}
            centered
            width={'80%'}
            closable={false}
            visible={visible}
            maskClosable={false}
            title={<p style={{marginBottom: '0px'}}>Phê duyệt yêu cầu <b>#{currentRow?.id}</b></p>}
            footer={[
                <Button key="back" disabled={pending} onClick={() => {
                    if (step === 0) {
                        setVisible(false)
                        setLoading(true)
                        exitTicket(currentRow.id).then(resp => {
                            if (resp.status === 200) {
                                Modal.info({
                                    content: resp?.data?.message
                                })
                            }
                        }).finally(() => setLoading(false))
                        return
                    }
                    setStep(step - 1)
                }}>
                    {step === 0 ? 'Huỷ bỏ' : 'Quay lại'}
                </Button>,
                <Button key="submit" type="primary"
                        disabled={isDisableNextStep()}
                        loading={pending} onClick={() => {
                    if (step === 1) {
                        Modal.confirm({
                            title: 'Xác nhận',
                            content: 'Bạn có chắc chắn muốn phê duyệt yêu cầu này?',
                            okText: 'Đồng ý',
                            cancelText: 'Hủy bỏ',
                            onOk: () => {
                                setStep(2)
                                setInitDetail(true)
                                setPending(true)
                                resolveErrorDeposit(rechargePendingSelected.id).then(resp => {
                                    if (resp.status === 200) {
                                        Modal.success({
                                            content: resp?.data?.message
                                        })
                                        setReload(reload + 1)
                                        setCurrentRow(null)
                                        setStep(0)
                                    }
                                }).catch(err => {
                                    setStep(1)
                                    Modal.error({
                                        content: err.response?.data?.message
                                    })
                                }).finally(() => {
                                    setInitDetail(false)
                                    setPending(false)
                                    setVisible(false)
                                })
                            }
                        })
                        return
                    }
                    setStep(step + 1)
                }}>
                    {step === 1 ? 'Phê duyệt yêu cầu' : 'Tiếp theo'}
                </Button>
            ]}
        >
            {currentRow &&
            <Fragment>
                <Spin spinning={initDetail} indicator={antIcon}>
                    <Steps current={step} className={'m-b-10'}>
                        <Step title="Chọn phiếu nạp lỗi"/>
                        <Step title="Chi tiết phiếu"/>
                        <Step title="Phê duyệt"/>
                    </Steps>
                    <div style={{display: step !== 0 ? 'none' : 'block'}}>
                        <ListRechargePending style={{visibility: 'hidden'}}
                                             loading={setInitDetail}
                                             setStep={setStep}
                                             rechargePendingSelected={rechargePendingSelected}
                                             setRechargePendingSelected={setRechargePendingSelected}/>
                    </div>
                    <div style={{display: step !== 1 ? 'none' : 'block'}}>
                        <RechargeDetail rechargePendingDetail={rechargePendingSelected} mapType={MAP_TYPE}/>
                    </div>
                    <div style={{display: step !== 2 ? 'none' : 'block'}}>
                    </div>
                </Spin>
            </Fragment>
            }
        </Modal>
        <Modal
            className={'modal-body-80vh'}
            centered
            width={'80%'}
            closable={false}
            visible={visibleReject}
            maskClosable={false}
            title={<p style={{marginBottom: '0px'}}>Từ chối phê duyệt</p>}
            footer={[
                <Button key="back" disabled={initDetail} onClick={() => {
                    setVisibleReject(false)
                    setComment('')
                    setErrorComment('')
                }}>
                    Huỷ bỏ
                </Button>,
                <Button key="submit" type="primary" loading={initDetail} onClick={() => {
                    if (comment) {
                        handleRejectTicket()
                    } else {
                        setErrorComment('Vui lòng nhập lý do từ chối')
                    }
                }}>
                    Từ chối
                </Button>
            ]}
        >
            <Spin spinning={initDetail} indicator={antIcon}>
                <p><span style={{color: 'red'}}>*</span>Lý do từ chối: </p>
                <TextArea autoFocus={true} rows={10} value={comment} onChange={e => {
                    const value = e.target.value
                    setComment(value)
                    if (!value) {
                        setErrorComment('Vui lòng nhập lý do từ chối')
                    } else {
                        setErrorComment('')
                    }
                }}/>
                <p style={{color: 'red'}}>{errorComment}</p>
            </Spin>
        </Modal>
    </Fragment>
}