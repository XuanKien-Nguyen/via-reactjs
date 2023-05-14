import React, { Fragment, useEffect, useState } from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import { getLogDownloadProduct, getLogDownloadProductType } from "../../../../../services/user";
import { useTranslation } from "react-i18next";
import Tag from "antd/es/tag";
import './style.scss'

const MAP_TYPE = {}

export default ({ loading }) => {

    const [datasource, setDatasource] = useState([])
    const [downloadTypeList, setDownloadTypeList] = useState([])

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
        // {
        //     title: t('order.type'),
        //     width: '200px',
        //     dataIndex: 'type',
        //     render: type => <Tag color={'grey'}>{t(MAP_TYPE[type])}</Tag>,
        //     align: 'center',
        // },
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

    useEffect(() => {
        getLogDownloadProductType().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.TYPE_OBJ || []
                const lstType = [{label: 'download-type.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstType.push({
                        label: `download-type.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `download-type.${key}`
                }
                setDownloadTypeList(lstType)
            }
        })
    }, [])

    const getDownloadTypeList = () => {
        return downloadTypeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    return <Fragment>
        <Search setList={setDatasource}
            api={getLogDownloadProduct}
            loading={loading}
            setPageInfo={setPage}
            page={page}
            t={t}
            getDownloadTypeList={getDownloadTypeList}
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