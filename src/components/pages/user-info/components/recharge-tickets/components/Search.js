import { Button, Collapse, Icon, message } from "antd";
import FilterItem from "../../../../category/components/filter/FilterItem";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
const { Panel } = Collapse

const dateFormat = 'YYYY-MM-DD';

let debounce = null

export default ({ setRechargeTicketList, api, loading, setPageInfo, page, getTicketsStatusList, reload }) => {

    const { t } = useTranslation()

    const [init, setInit] = useState(0)
    const [content, setContent] = useState('')
    const [lastestDecidedBy, setLastestDecidedBy] = useState('')
    const [createDate, setCreateDate] = useState([])
    const [lastestDate, setLastestDate] = useState([])
    const [status, setStatus] = useState('')

    const onReset = () => {
        setCreateDate([])
        setLastestDate([])
        setContent('')
        setStatus('')
        setLastestDecidedBy('')
    }

    useEffect(() => {
        getList()
    }, [])

    useEffect(() => {
        getList()
    }, [reload])

    useEffect(() => {
        if (init > 1) {
            getList()
        }
        setInit(init + 1)
    }, [createDate, lastestDate, status, page.perpage, page.currentPage])


    useEffect(() => {
        if (init > 1) {
            clearTimeout(debounce)
            debounce = setTimeout(() => {
                getList()
            }, 500)
        }
        setInit(init + 1)
    }, [content, lastestDecidedBy])

    const getList = () => {
        let created_time = ''
        let lastest_time = ''
        if (createDate.length > 0) {
            created_time = JSON.stringify(createDate?.map(el => el?.format(dateFormat)))
        }
        if (lastestDate.length > 0) {
            lastest_time = JSON.stringify(lastestDate?.map(el => el?.format(dateFormat)))
        }
        const body = {
            content,
            status,
            lastestDecidedBy,
            created_time,
            lastest_time,
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
                    total: data.totalRechargeTickets,
                    perpage: data.perPage,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage === 0 ? 1 : data.currentPage,
                }
                setPageInfo(pageInfo)
                setRechargeTicketList(resp?.data?.rechargeTicketList || [])
            }
        }).catch(() => message.error('Có lỗi xảy ra khi lấy thông tin phiếu nạp lỗi'))
            .finally(() => loading(false))
    }

    return <div className='filter-order'>
        <div className='filter' style={{ padding: '0px' }}>
            <Collapse className='filter-layout' accordion style={{ backgroundColor: '#e9e9e9' }} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled" />&nbsp;{t('filter.title')}</div>
                </div>}>     
                    <FilterItem defaultValue={content} setValue={setContent} type={'text'} title={t('filter.content')} />
                    <FilterItem defaultValue={lastestDecidedBy} setValue={setLastestDecidedBy} type={'text'} title={t('filter.lastest_decided_by')} />
                    <FilterItem defaultValue={status} setValue={setStatus} options={getTicketsStatusList()} type={'select'}
                        title={t('filter.type')} />
                    <FilterItem defaultValue={createDate} setValue={setCreateDate} type={'date'}
                        placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')} />
                    <FilterItem defaultValue={lastestDate} setValue={setLastestDate} type={'date'}
                        placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.lastest_decided_date')} />
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}