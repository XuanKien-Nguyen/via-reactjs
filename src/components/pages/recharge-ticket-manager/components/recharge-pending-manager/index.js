import React, {Fragment, useEffect, useState} from "react";
import Search from "./components/Search";
import FilterItem from "../../../category/components/filter/FilterItem";
import TableCommon from '../../../../common/table'
import {getAllRechargePending, getTypeListRechargePending} from "../../../../../services/recharge-manager";
import {useSelector} from "react-redux";
import {convertCurrencyVN} from "../../../../../utils/helpers";
import {Button, Tag} from "antd";
import {useTranslation} from "react-i18next";

const dateFormat = 'YYYY-MM-DD';
const MAP_TYPE = {};
let mouseDown = false;
let startX, scrollLeft, slider1, startDragging, stopDragging, handleDragging;
export default ({loading, setRechargePendingSelected, setStep, rechargePendingSelected}) => {
    const {t} = useTranslation()
    const [ds, setDs] = useState([])
    const [rechargeTicketId, setRechargeTicketId] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [content, setContent] = useState('')
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [typeList, setTypeList] = useState([])
    const [createdDate, setCreatedDate] = useState([])
    const [lastestDecicedBy, setLastestDecicedBy] = useState('')
    const [lastestDecicedDate, setLastestDecicedDate] = useState([])

    const [page, setPage] = useState({
        perpage: 5,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getTypeListRechargePending({status: 'pending'}).then(resp => {
            const data = resp.data?.TYPE_OBJ || [];
            const lstType = [{label: 'recharge-type.ALL', value: ''}]
            for (const key of Object.keys(data)) {
                lstType.push({
                    label: `recharge-type.${key}`,
                    value: data[key],
                })
                MAP_TYPE[data[key]] = `recharge-type.${key}`
            }
            setTypeList(lstType)
        })
    }, [])

    const getTypeList = () => {
        return typeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }


    useEffect(() => {
        // if (!slider) {
        slider1 = document.querySelector('#tb2 .ant-table-content .ant-table-body');
        slider1.onmousedown = () => {
            slider1.classList.add('do_scroll')
        }
        slider1.onmouseup = () => {
            slider1.classList.remove('do_scroll')
        }
        // }
        setTimeout(() => {
            startDragging = (e) => {
                mouseDown = true;
                startX = e.pageX;
                scrollLeft = slider1.scrollLeft;
            };
            stopDragging = () => {
                mouseDown = false;
            };

            handleDragging = (e) => {
                e.preventDefault();
                if (!mouseDown) {
                    return;
                }
                const x = e.pageX - slider1.offsetLeft;
                const scroll = x - startX;
                slider1.scrollLeft = scrollLeft - scroll;
            }

            slider1.addEventListener('mousemove', handleDragging);
            slider1.addEventListener('mousedown', startDragging, false);
            slider1.addEventListener('mouseup', stopDragging, false);
            slider1.addEventListener('mouseleave', stopDragging, false);
        }, 500)
        return () => {
            slider1.removeEventListener('mousemove', handleDragging);
            slider1.removeEventListener('mousedown', startDragging, false);
            slider1.removeEventListener('mouseup', stopDragging, false);
            slider1.removeEventListener('mouseleave', stopDragging, false);
        }
    }, [])

    const getItems = () => {
        return [
            <FilterItem defaultValue={transactionId}
                        setValue={setTransactionId}
                        type={'text'}
                        title={'Mã giao dịch'}
                        allowClear={true}/>,
            <FilterItem defaultValue={content}
                        setValue={setContent}
                        type={'text'}
                        title={'Nội dung'}
                        allowClear={true}/>,
            <FilterItem defaultValue={rechargeTicketId}
                        setValue={setRechargeTicketId}
                        type={'text'}
                        title={'Mã ticket nạp lỗi'}
                        allowClear={true}/>,
            <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                        title={'Loại'}/>,
            <FilterItem defaultValue={createdDate} setValue={setCreatedDate} type={'date'}
                        placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày tạo'}/>,
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
            status: 'pending',
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
                }
            },
            reject: (err) => console.log(err)
        }
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
            title: 'Mã ticket nạp lỗi',
            dataIndex: 'recharge_ticket_id',
            width: '150px',
            render: recharge_ticket_id => recharge_ticket_id ? <b>{recharge_ticket_id}</b> : '-',
            align: 'center'
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
            title: 'Thời gian tạo',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Thao tác',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Button type='primary' disabled={rechargePendingSelected?.id === row.id}
                            style={{marginRight: '8px'}} onClick={() => {
                        setRechargePendingSelected(row)
                        setStep(1)
                    }}>{rechargePendingSelected?.id === row.id ? 'Đã chọn' : 'Chọn'}</Button>
                </div>
            }
        },
    ]

    return <Fragment>
        <Search items={getItems()}
                search={setupSearch()}
                loading={loading}
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
                page={page}/>
        <TableCommon
            id={'tb2'}
            bordered={true}
            page={page}
            datasource={ds}
            columns={columns}
            rowKey="id"
            scrollToID={'tb2'}
            setPage={setPage}
            scroll={{x: true}}
        />
    </Fragment>
}