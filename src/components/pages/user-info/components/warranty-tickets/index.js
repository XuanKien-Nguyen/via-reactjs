import React, {useState, useEffect, Fragment} from "react";
import Search from "./components/Search";
import FilterItem from "../../../category/components/filter/FilterItem";
import TableCommon from "../../../../common/table";
import CreateWarranty from "./components/create-warranty";
import Detail from "./components/Detail";
import {getWarrantyTicket, getStatusList} from "../../../../../services/warranty-tickets";
import {convertCurrencyVN} from "../../../../../utils/helpers";
import {Button, Icon, Tooltip, Tag} from "antd";
import {useTranslation} from "react-i18next";

const dateFormat = 'YYYY-MM-DD';

const MAP_STATUS = {};

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}

export default ({loading}) => {

    const {t} = useTranslation()

    const [ds, setDs] = useState([])
    const [comment, setComment] = useState('')
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState('')
    const [statusList, setStatusList] = useState([])
    const [createdDate, setCreatedDate] = useState([])
    const [lastestDecicedBy, setLastestDecicedBy] = useState('')
    const [lastestDecicedDate, setLastestDecicedDate] = useState([])
    const [visible, setVisible] = useState(false)
    const [visibleDetail, setVisibleDetail] = useState(false)
    const [warrantyDetail, setWarrantyDetail] = useState(null)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    const reloadTable = () => {
        setReload(reload + 1)
    }

    useEffect(() => {
        getStatusList().then(resp => {
            const data = resp.data?.STATUS_OBJ || []
            const lstStatus = [{label: 'warranty_tickets_status.ALL', value: ''}]
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: `warranty_tickets_status.${key}`,
                    value: data[key]
                })
                MAP_STATUS[data[key]] = `warranty_tickets_status.${key}`
            }
            setStatusList(lstStatus)
        })
    }, [])


    const getStatusListMap = () => {
        return statusList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={title}
                        setValue={setTitle}
                        type={'text'}
                        title={t('warranty-tickets.title')}
                        allowClear={true}/>,
            <FilterItem defaultValue={comment}
                        setValue={setComment}
                        type={'text'}
                        title={t('warranty-tickets.comment')}
                        allowClear={true}/>,
            <FilterItem defaultValue={status} setValue={setStatus} options={getStatusListMap()} type={'select'}
                        title={t('warranty-tickets.status')}/>,
            <FilterItem defaultValue={lastestDecicedBy}
                        setValue={setLastestDecicedBy}
                        type={'text'}
                        title={t('warranty-tickets.latest_decidedby')}
                        allowClear={true}/>,
            <FilterItem defaultValue={createdDate} setValue={setCreatedDate} type={'date'}
                        placeholder={[t('filter.from'), t('filter.to')]} title={t('warranty-tickets.created_time')}/>,
            <FilterItem defaultValue={lastestDecicedDate} setValue={setLastestDecicedDate} type={'date'}
                        placeholder={[t('filter.from'), t('filter.to')]}
                        title={t('warranty-tickets.latest_decided_time')}/>,
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
            status,
            title,
            latest_decidedby: lastestDecicedBy,
            latest_decided_time,
            created_time,
            comment,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getWarrantyTicket(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.warranty_tickets || [])
                    setPage({
                        ...page,
                        total: resp.data.totalWarrantyTickets
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
            title: t('warranty-tickets.title'),
            dataIndex: 'title',
            width: '250px',
            align: 'center'
        },
        {
            title: t('warranty-tickets.category_price'),
            dataIndex: 'category_price',
            render: v => <b>{convertCurrencyVN(v)}</b>,
            width: '250px',
            align: 'center'
        },
        {
            title: t('warranty-tickets.status'),
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={STATUS_COLOR[status]}>{t(MAP_STATUS[status])}</Tag>
        },
        {
            title: t('warranty-tickets.total_product_request'),
            width: '300px',
            dataIndex: 'total_product_request',
            align: 'center'
        },
        {
            title: t('warranty-tickets.total_product_replace'),
            width: '300px',
            dataIndex: 'total_product_replace',
            align: 'center'
        },
        {
            title: t('warranty-tickets.total_product_reject'),
            width: '300px',
            dataIndex: 'total_product_reject',
            align: 'center'
        },
        {
            title: t('warranty-tickets.total_refund_warranty'),
            width: '300px',
            dataIndex: 'total_refund_warranty',
            render: v => <b>{convertCurrencyVN(v)}</b>,
            align: 'center'
        },
        {
            title: t('warranty-tickets.created_time'),
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: t('warranty-tickets.latest_decidedby'),
            width: '200px',
            dataIndex: 'latest_decidedby',
            align: 'center'
        },
        {
            title: t('warranty-tickets.latest_decided_time'),
            width: '200px',
            dataIndex: 'latest_decided_time',
            align: 'center'
        },
        {
            title: t("warranty-tickets.action"),
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title={t('warranty-tickets.detail')}>
                        <Button type='primary' style={{marginRight: '8px'}} onClick={() => {
                            setVisibleDetail(true)
                            setWarrantyDetail(row)
                        }}><Icon type="file-search"/></Button>
                    </Tooltip>
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
                state={[comment, title, status, lastestDecicedBy, createdDate, lastestDecicedDate]}
                onReset={() => {
                    setComment('')
                    setStatus('')
                    setTitle('')
                    setLastestDecicedBy('')
                    setCreatedDate([])
                    setLastestDecicedDate([])
                }}
                page={page}/>
        <p style={{textAlign: 'right'}}>
            <Button type={"primary"} onClick={() => {
                setVisible(true)
            }}><Icon type={'plus'}/> {t('warranty-tickets.create-warranty')}</Button>
        </p>
        <TableCommon
            className='table-order'
            bordered={true}
            page={page}
            datasource={ds}
            columns={columns}
            rowKey="id"
            setPage={setPage}
            scroll={{x: true}}
        />
        <CreateWarranty t={t} visible={visible} setVisible={setVisible} reload={reloadTable}/>
        <Detail detail={warrantyDetail} setDetail={setWarrantyDetail} visible={visibleDetail} setVisible={setVisibleDetail} reload={reloadTable} mapStatus={MAP_STATUS}/>
    </Fragment>
}