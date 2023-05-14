import React, { Fragment, useEffect, useState } from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import { getAllRechargeTickets, getRechargeTicketsStatusList } from "../../../../../services/tickets";
import { useTranslation } from "react-i18next";
import Tag from "antd/es/tag";
import './style.scss'

const MAP_TYPE = {}

export default ({ loading }) => {

    const [rechargeTicketList, setRechargeTicketList] = useState([])
    const [ticketsStatusList, setTicketsStatusList] = useState([])

    const { t } = useTranslation()

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const onChangePage = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: currentPage
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: 1
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            width: '100px',
            render: id => <b>#{id}</b>
        },
        {
            title: 'Status',
            width: '150px',
            dataIndex: 'status',
            render: s => <Tag color={'grey'}>{t(MAP_TYPE[s])}</Tag>,
            align: 'center',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            align: 'center',
            width: '300px'
        },
        {
            title: 'Added Bonus',
            dataIndex: 'added-bonus',
            align: 'center',
            width: '150px',
        },
        {
            title: 'Added Amount',
            dataIndex: 'added-amount',
            align: 'center',
            width: '150px',
        },
        {
            title: 'Create time',
            dataIndex: 'create-time',
            align: 'center',
            width: '200px',
        },
        {
            title: 'Lastest decide by',
            dataIndex: 'lastest-decidedby',
            align: 'center',
            width: '200px',
        },
        {
            title: 'Lastest decided time',
            dataIndex: 'lastest-decided-time',
            align: 'center',
            width: '200px',
        },
    ];

    useEffect(() => {
        getRechargeTicketsStatusList().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.STATUS_OBJ || []
                const lstStatus = [{label: 'recharge-tickets-status.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstStatus.push({
                        label: `recharge-tickets-status.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `recharge-tickets-status.${key}`
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

    return <Fragment>
        <Search setList={setRechargeTicketList}
            api={getAllRechargeTickets}
            loading={loading}
            setPageInfo={setPage}
            page={page}
            t={t}
            getTicketsStatusList={getTicketsStatusList}
        />
        <TableCommon className='table-order'
            style={{ overflow: 'auto' }}
            bordered={true}
            page={page}
            datasource={rechargeTicketList}
            columns={columns}
            // expandedRowRender={expandRender}
            rowKey="id"
            onChangePage={onChangePage}
            onChangeSize={onChangeSize} />
    </Fragment>
}