import React, {useEffect, useState, Fragment} from "react";
import {message, Button, Icon, Tooltip, Tag} from "antd";
import {purchaseList, downloadPurchase, getPurchaseType, getPurchaseStatus} from "../../../../../services/purchases";
import {convertCurrencyVN, textToFile} from '../../../../../utils/helpers'
import Search from './components/Search'
import TableCommon from '../../../../common/table'
import {useHistory} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default ({loading}) => {

    const { t } = useTranslation()
    const query = new URLSearchParams(window.location.search);
    const history = useHistory()
    const [ds, setDs] = useState([])
    const [purchaseType, setPurchaseType] = useState([])
    const [purchaseStatus, setPurchaseStatus] = useState([])

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const columns = [
        {
            title: t('order.id'),
            dataIndex: 'id',
            width: '150px',
            render: id => `#${id}`,
            align: 'center'
        },
        {
            title: t('order.date'),
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: t('order.content'),
            width: '300px',
            dataIndex: 'content',
            align: 'center'
        },
        {
            title: t('order.payment-method'),
            dataIndex: 'purchase_type',
            align: 'center',
            width: '150px',
            render: val => val === 'direct' ? t('order.direct') : t('order.api')
        },
        {
            title: t('order.status'),
            dataIndex: 'status',
            align: 'center',
            width: '150px',
            render: status => {
                const r = {
                    color: '#f50',
                    text: t('order.invalid')
                }
                if (status === 'valid') {
                    r.color = '#87d068'
                    r.text = t('order.valid')
                }
                return <Tag color={r.color}>{r.text}</Tag>
            }
        },
        {
            title: t('order.total'),
            width: '200px',
            render: row => {
                return <div>
                    <b>{convertCurrencyVN(row.total_amount)}</b>
                </div>
            }
        },
        {
            title: t('order.action'),
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title={t('order.detail')}>
                        <Button type='primary' onClick={() => history.push({search: `?menu=${query.get('menu')}&id=${row.id}`})}><Icon type="file-search" /></Button>
                    </Tooltip>
                    <br/>
                    <Tooltip title={t('order.download')}>
                        <Button type={'danger'} style={{margin: '5px 0px'}} onClick={() => handleDownload(row.id, row.category_name)}><Icon type="download" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ];

    const handleDownload = (id, categoryName) => {
        loading(true)
        downloadPurchase(id).then(resp => {
            const {data} = resp
            message.success(data.message)
            const content = data.purchaseDownloadList.join('\r\n');
            textToFile(categoryName, content)
        }).catch(err => {
            message.error(err.response?.data?.message || t('order.download-error'))
        }).finally(() => loading(false))
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

    useEffect(() => {
        getPurchaseType().then(resp => {
                if (resp.status === 200) {
                    const data = resp.data?.TYPE_OBJ || []
                    const lstType = [{label: 'purchase-type.ALL', value: ''}]
                    for (const key of Object.keys(data)) {
                        lstType.push({
                            label: `purchase-type.${key}`,
                            value: data[key]
                        })
                    }
                    setPurchaseType(lstType)
                }
            }
        )
        getPurchaseStatus().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.STATUS_OBJ || []
                const lstStatus = [{label: 'purchase-status.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstStatus.push({
                        label: `purchase-status.${key}`,
                        value: data[key]
                    })
                }
                setPurchaseStatus(lstStatus)
            }
        }
    )
    }, [])

    const getTypeList = () => {
        return purchaseType.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    } 

    const getStatusList = () => {
        return purchaseStatus.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    } 

    return <Fragment>
        <Search setPurchaseList={setDs} 
                api={purchaseList} 
                loading={loading} 
                setPageInfo={setPage} 
                page={page}
                getTypeList={getTypeList}
                getStatusList={getStatusList}
        />
        <TableCommon
            className='table-order'
            bordered={true}
            page={page}
            datasource={ds}
            columns={columns}
            rowKey="id"
            onChangePage={onChangePage}
            onChangeSize={onChangeSize}
            scroll={{x: true}}
        />
    </Fragment>

}