import React, {Fragment} from "react";
import {Table, Tag} from "antd";

import {convertCurrencyVN} from "../../../../../../utils/helpers";
import {useTranslation} from "react-i18next";

export default ({rechargePendingDetail, mapType}) => {

    const {t} = useTranslation()

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
            value: <b>#{rechargePendingDetail?.id}</b>
        },
        {
            title: 'Mã ticket nạp lỗi',
            value: <b>{rechargePendingDetail?.recharge_ticket_id ? rechargePendingDetail?.recharge_ticket_id : '-'}</b>
        },
        {
            title: 'Mã giao dịch',
            value: <b>{rechargePendingDetail?.transaction_id ? rechargePendingDetail?.transaction_id : '-'}</b>
        },
        {
            title: 'Tiền tài khoản',
            value: <b style={{color: 'red'}}>{convertCurrencyVN(rechargePendingDetail?.amount)}</b>
        },
        {
            title: 'Tiền USDT',
            value: rechargePendingDetail?.usdt_amount
        },
        {
            title: 'USDT/VND',
            value: rechargePendingDetail?.rate
        },
        {
            title: 'Loại',
            value: <Tag style={{marginRight: 0}}
                        color={rechargePendingDetail?.type === 'banking' ? 'blue' : 'grey'}>{t(mapType[rechargePendingDetail?.type])}</Tag>
        },
        {
            title: 'Nội dung:',
            value: rechargePendingDetail?.content
        },
        {
            title: 'Thời gian tạo',
            value: rechargePendingDetail?.created_time
        },
    ]

    return <div>
        {rechargePendingDetail && <Fragment>
            <Table showHeader={false} rowKey="title" dataSource={dataSource} columns={columns} pagination={false}
                   locale={{emptyText: 'Không có dữ liệu'}}/>
        </Fragment>}
    </div>
}