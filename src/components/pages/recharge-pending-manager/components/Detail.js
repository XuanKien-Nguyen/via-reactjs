import React, {useEffect, useState, Fragment} from "react";
import { getRechargePendingById, getRechargePendingByTicketId } from "../../../../services/recharge-manager";
import {Table, Tag} from "antd";

import {convertCurrencyVN} from "../../../../utils/helpers";
import {useTranslation} from "react-i18next";

export default ({id, loading, mapType, mapStatus}) => {

    const [rechargePendingDetail, setRechargePendingDetail] = useState({})

    const { t } = useTranslation()

    const columns = [
        {
            title: '',
            render: row => <b>{row.title}</b>           
        },
        {
            title: '',
            render: row => row.value ? row.value : '-',
            align: 'right'
        },
    ]

    const dataSource = [
        {
            title: 'ID',
            value: <b>#{rechargePendingDetail.id}</b>
        },
        {
            title: 'Mã ticket nạp lỗi',
            value: <b>{rechargePendingDetail.recharge_ticket_id ? rechargePendingDetail.recharge_ticket_id : '-'}</b>
        },
        {
            title: 'Mã giao dịch',
            value: <b>{rechargePendingDetail.transaction_id ? rechargePendingDetail.transaction_id : '-'}</b>
        },
        {
            title: 'Tiền tài khoản',
            value: <b style={{color: 'red'}}>{convertCurrencyVN(rechargePendingDetail.amount)}</b> 
        },
        {
            title: 'Tiền USDT',
            value: rechargePendingDetail.usdt_amount
        },
        {
            title: 'USDT/VND',
            value: rechargePendingDetail.rate
        },
        {
            title: 'Loại',
            value: <Tag style={{marginRight: 0}} color={rechargePendingDetail.type === 'banking' ? 'blue' : 'grey'}>{t(mapType[rechargePendingDetail.type])}</Tag>
        },
        {
            title: 'Trạng thái',
            value: <Tag style={{marginRight: 0}} color={ rechargePendingDetail.status === 'done' ? 'green' : 'grey'}>{t(mapStatus[ rechargePendingDetail.status])}</Tag>
        },
        {
            title: 'Nội dung:',
            value: rechargePendingDetail.content
        },
        {
            title: 'Thời gian tạo',
            value: rechargePendingDetail.created_time
        },
        {
            title: 'Thời gian quyết định',
            value: rechargePendingDetail.latest_decided_time
        },
        {
            title: 'Người quyết định',
            value: rechargePendingDetail.latest_decidedby
        },
    ]

    useEffect(() => {
        const init = async () => {
            loading(true)
            const resp = await getRechargePendingById(id)
            if (resp.status === 200) {
                const rechargeDetail = resp?.data?.pendingRechargeFound
                setRechargePendingDetail(rechargeDetail)
            }
            loading(false)
        }
        init()
    }, [])

    return <div>
        {rechargePendingDetail.id ? <Fragment>
            <Table showHeader={false} rowKey="title" dataSource={dataSource} columns={columns} pagination={false} locale={{emptyText: 'Không có dữ liệu'}}/>
        </Fragment> : <p>Không tìm thấy chi tiết ticket nạp lỗi</p>}
    </div>
}