import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../../category/components/filter/FilterItem";
import React, {useEffect, useState} from "react";
const { Panel } = Collapse

const dateFormat = 'YYYY-MM-DD';
const PURCHASE_TYPE = [{label: 'Tất cả', value: ''}, {label: 'Trực tiếp', value: 'direct'}, {label: 'Cộng tác viên', value: 'api'}]
const STATUS_LIST = [{label: 'Tất cả', value: ''}, {label: 'Bảo hành', value: 'valid'}, {label: 'Hết bảo hành', value: 'invalid'}]

export default ({setPurchaseList, api, loading, setPageInfo, page}) => {

    const [uid, setUid] = useState('')
    const [date, setDate] = useState(['', ''])
    const [purchaseType, setPurchaseType] = useState('')
    const [status, setStatus] = useState('')

    const onReset = () => {
        setDate(['', ''])
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
        if ( typeof date[0] !== 'string') {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        } else {
            created_time = JSON.stringify(date)
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

    return  <div className='product-page'>
        <div className='filter'>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'><div><Icon type="filter" theme="filled" />&nbsp;Bộ lọc</div></div>}>
                    <FilterItem defaultValue={uid} setValue={setUid} type={'text'} title={'UID'}/>
                    <FilterItem defaultValue={date} setValue={setDate} type={'date'} placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày'}/>
                    <FilterItem defaultValue={purchaseType} setValue={setPurchaseType} options={PURCHASE_TYPE} type={'select'} title={'Phương thức thanh toán'}/>
                    <FilterItem defaultValue={status} setValue={setStatus} options={STATUS_LIST} type={'select'} title={'Tình trạng'}/>
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload" onClick={onReset}>Reset</Button>
        </div>
    </div>
}