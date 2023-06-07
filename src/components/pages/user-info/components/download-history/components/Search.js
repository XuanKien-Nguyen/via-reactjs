import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../../category/components/filter/FilterItem";
import React, {useEffect, useState} from "react";

const { Panel } = Collapse

const dateFormat = 'YYYY-MM-DD';

export default ({setList, api, loading, setPageInfo, page, t, getDownloadTypeList}) => {

    const [date, setDate] = useState([])
    const [downloadType, setDownloadType] = useState('')

    const onReset = () => {
        setDate([])
        setDownloadType('')
    }

    useEffect(() => {
        getList()
    }, [])

    useEffect(() => {
        getList()
    }, [date, JSON.stringify(page)])

    const getList = () => {
        let created_time = ''
        if (date.length > 0) {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        }
        const body = {
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
                    total: data.totalLogDownloadProducts,
                    perpage: data.perPage,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                }
                setPageInfo(pageInfo)
                setList(resp?.data?.logDownloadPurchaseList || [])
            }
        }).catch(() => message.error(t('message.error_get_download')))
            .finally(() => loading(false))
    }

    return <div className='filter-order'>
        <div className='filter' style={{padding: '0px'}}>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                </div>}>
                    <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                    {/* <FilterItem defaultValue={downloadType} setValue={setDownloadType} options={getDownloadTypeList()} type={'select'}
                                allowClear={true}
                                title={t('filter.type')}/> */}
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}