import React, { Fragment, useEffect, useState, useContext } from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import CreateTicket from "./components/CreateTicket";
import { getAllRechargeTickets, getRechargeTicketsStatusList } from "../../../../../services/tickets";
import { useTranslation } from "react-i18next";
import Tag from "antd/es/tag";
import { Button, Icon, Modal } from "antd";
import './style.scss'

const MAP_TYPE = {}

export default ({ loading }) => {

    const [rechargeTicketList, setRechargeTicketList] = useState([])
    const [ticketsStatusList, setTicketsStatusList] = useState([])
    const [visible, setVisible] = useState(false)
    const [render, setRender] = useState(0)

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
            title: t('recharge-tickets.id'),
            dataIndex: 'id',
            align: 'center',
            width: '100px',
            render: id => <b>#{id}</b>
        },
        {
            title: t('recharge-tickets.status'),
            width: '150px',
            dataIndex: 'status',
            render: s => <Tag color={'grey'}>{t(MAP_TYPE[s])}</Tag>,
            align: 'center',
        },
        {
            title: t('recharge-tickets.image'),
            dataIndex: 'image_url',
            align: 'center',
            width: '200px',
            render: image_url => <div className="recharge-tickets_image"><img alt="recharge-tickets" src={image_url} /><Icon type='eye' style={{color: 'white', fontSize: '24px'}} onClick={() => {onShowImage(image_url)}}/></div>
        },
        {
            title: t('recharge-tickets.content'),
            dataIndex: 'content',
            align: 'center',
            width: '300px'
        },
        {
            title: t('recharge-tickets.added-bonus'),
            dataIndex: 'added_bonus',
            align: 'center',
            width: '150px',
        },
        {
            title: t('recharge-tickets.added-amount'),
            dataIndex: 'added_amount',
            align: 'center',
            width: '150px',
        },
        {
            title: t('recharge-tickets.created-time'),
            dataIndex: 'created_time',
            align: 'center',
            width: '200px',
        },
        {
            title: t('recharge-tickets.lastest-decided-by'),
            dataIndex: 'lastest_decidedby',
            align: 'center',
            width: '200px',
        },
        {
            title: t('recharge-tickets.lastest-decided-time'),
            dataIndex: 'lastest_decided_time',
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

    const onCreateTickets = () => {
        setVisible(true)
    }

    const onShowImage = (url) => {
        Modal.info({
            className: "recharge-tickets-image_modal",
            content: <div><img alt="recharge-tickets" src={url}/></div>,
            maskClosable: true,
        })
    }

    return <Fragment>
        <Search setRechargeTicketList={setRechargeTicketList}
            api={getAllRechargeTickets}
            loading={loading}
            setPageInfo={setPage}
            page={page}
            t={t}
            getTicketsStatusList={getTicketsStatusList}
            render={render}
        />
        <Button style={{marginBottom: '16px'}} type="primary" icon="plus" onClick={onCreateTickets}>{t('recharge-tickets.button-create')}</Button>
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
            <CreateTicket visible={visible} setVisible={setVisible} setRender={setRender} render={render}/>
    </Fragment>
}