import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../../category/components/filter/FilterItem";
import React, {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';

const {Panel} = Collapse

const dateFormat = 'YYYY-MM-DD';

let debounce = null

export default ({setPurchaseList, api, loading, setPageInfo, page, getTypeList, getStatusList}) => {

    const {t} = useTranslation()

    const [uid, setUid] = useState('')
    const [init, setInit] = useState(0)
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
        if (init > 1) {
            getList()
        }
        setInit(init + 1)
    }, [date, purchaseType, status, page.perpage, page.currentPage])

    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            getList()
        }, 500)
    }, [uid])

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
                    currentPage: data.currentPage === 0 ? 1 : data.currentPage,
                }
                setPageInfo(pageInfo)
                setPurchaseList(resp?.data?.newPurchaseList || [])
            }
        }).catch(() => message.error(t('message.error_get_purchase')))
            .finally(() => loading(false))
    }

    return <div className='filter-order'>
        <div className='filter' style={{padding: '0px'}}>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                </div>}>
                    <FilterItem defaultValue={uid} setValue={setUid} type={'text'} title={t('filter.uid')}
                                allowClear={true}/>
                    <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                placeholder={[t('filter.from'), t('filter.to')]} title={t('order.date')}/>
                    <FilterItem defaultValue={purchaseType} setValue={setPurchaseType} options={getTypeList()}
                                type={'select'} title={t('filter.payment_method')}/>
                    <FilterItem defaultValue={status} setValue={setStatus} options={getStatusList()} type={'select'}
                                title={t('filter.status')}/>
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}