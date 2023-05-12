import React, { Fragment, useState } from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import { getLogDownloadProduct } from "../../../../../services/user";
import { useTranslation } from "react-i18next";
import './style.scss'
export default ({ loading }) => {

    const [datasource, setDatasource] = useState([])

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

    const goToOrderPurchaseDetail = (purchase_id) => {
        const query = new URLSearchParams(window.location.search)
        const menu = query.get('menu')
        const id = query.get('id')

        if (menu || menu === '') {
            query.delete('menu')
        }
        if (id || id === '') {
            query.delete('id')
        }

        query.append('menu', 'purchase')
        query.append('id', purchase_id)

        window.location.href = '/user-info?' + query.toString()
    }

    const columns = [
        {
            title: t('order.purchase-id'),
            dataIndex: 'purchase_id',
            align: 'center',
            width: '150px',
            render: purchase_id => <b style={{ cursor: 'pointer' }} onClick={() => { goToOrderPurchaseDetail(purchase_id) }}>#{purchase_id}</b>
        },
        {
            title: t('order.amount'),
            dataIndex: 'amount',
            align: 'center',
            width: '150px'
        },
        {
            title: t('order.content'),
            dataIndex: 'content',
            align: 'center',
            width: '500px'
        },
        {
            title: t('order.download-time'),
            dataIndex: 'created_time',
            align: 'center',
            width: '300px',
        },
    ];

    return <Fragment>
        <Search setList={setDatasource}
            api={getLogDownloadProduct}
            loading={loading}
            setPageInfo={setPage}
            page={page}
            t={t}
        />
        <TableCommon className='table-order'
            style={{ overflow: 'auto' }}
            bordered={true}
            page={page}
            datasource={datasource}
            columns={columns}
            // expandedRowRender={expandRender}
            rowKey="id"
            onChangePage={onChangePage}
            onChangeSize={onChangeSize} />
    </Fragment>
}