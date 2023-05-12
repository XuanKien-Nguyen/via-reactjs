import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../../category/components/filter/FilterItem";
import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
const { Panel } = Collapse

const dateFormat = 'YYYY-MM-DD';

export default ({setPurchaseList, api, loading, setPageInfo, page}) => {

    const { t } = useTranslation()

    const [uid, setUid] = useState('')
    const [date, setDate] = useState([])
    const [purchaseType, setPurchaseType] = useState('')
    const [status, setStatus] = useState('')

    const onReset = () => {
        setDate([])
        setUid('')
        setStatus('')
        setPurchaseType('')
    }

    useEffect(() => {
        getList()
    }, [])

    useEffect(() => {
        getList()
    }, [uid, date, purchaseType, status, JSON.stringify(page)])

    const getList = () => {
        let created_time = ''
        if (date.length > 0) {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        }
        const body = {
            uid,
            purchase_type: purchaseType,
            status,
            created_time,
            perpage: page.perpage,
            page: page.currentPage
        }
        for (const key of Object.keys(body)) {
            if (body[key] === "") {
                delete body[key];
            }
        }
        loading(true)
        api(body).then(resp => {
            if (resp.status === 200) {
                const data = resp.data
                const pageInfo = {
                    total: data.totalPurchases,
                    perpage: data.perPage,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                }
                setPageInfo(pageInfo)
                setPurchaseList(resp?.data?.newPurchaseList || [])
            }
        }).catch(() => message.error('Có lỗi xảy ra khi lấy thông tin đơn hàng'))
            .finally(() => loading(false))
    }

    const getPurchaseType = () => {
        return [{
            label: t('filter.all'),
            value: ''
        }, {
            label: t('order.direct'),
            value: 'direct'
        }, {
            label: t('order.api'),
            value: 'api'
        }]
    }

    const getStatusList = () => {
        return [{
            label: t('filter.all'),
            value: ''
        }, {
            label: t('order.valid'),
            value: 'valid'
        }, {
            label: t('order.invalid'),
            value: 'invalid'
        }]
    }

    return <div className='filter-order'>
        <div className='filter' style={{padding: '0px'}}>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                </div>}>
                    <FilterItem defaultValue={uid} setValue={setUid} type={'text'} title={t('filter.uid')}/>
                    <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                    <FilterItem defaultValue={purchaseType} setValue={setPurchaseType} options={getPurchaseType()}
                                type={'select'} title={t('filter.payment-method')}/>
                    <FilterItem defaultValue={status} setValue={setStatus} options={getStatusList()} type={'select'}
                                title={t('filter.status')}/>
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}