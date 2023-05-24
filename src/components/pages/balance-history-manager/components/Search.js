import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../category/components/filter/FilterItem";
import React, {useEffect, useState} from "react";
import {getCategoryList} from "../../../../services/category/category";

const {Panel} = Collapse

const dateFormat = 'YYYY-MM-DD';
let debounce = null

let init = 0

export default (props) => {

    const {
        setList,
        api,
        loading,
        setPageInfo,
        page,
        t,
        type,
        setType,
        getTypeList,
        setTotalAddedAmount,
        setTotalAddedBonus
    } = props

    const [date, setDate] = useState([])
    const [userId, setUserId] = useState(null)
    const [username, setUsername] = useState(null)
    const [transaction_id, set_transaction_id] = useState(null)
    const [recharge_ticket_id, set_recharge_ticket_id] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [categoryId, setCategoryId] = useState(null)

    const onReset = () => {
        setDate([])
        setType('')
    }

    const generateCategoryOption = (arr) => arr.map((e) => ({
        label: e.name,
        options: e.childCategoryList?.map((c) => {
            return {
                label: c.name,
                value: c.id,
                format: c.format
            }
        }) || []
    }))

    useEffect(() => {
        getCategoryList().then((resp) => {
            if (resp.status === 200) {
                const data = generateCategoryOption(resp?.data?.categoryListFound || [])
                setCategoryList(data);
            }
        }).catch(() => {
            message.error("Có lỗi xảy ra khi lấy danh sách danh mục")
        }).finally(() => {
        })
    }, [])

    useEffect(() => {
        getList()
    }, [date, type, page.perpage, page.currentPage, categoryId])

    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            getList()
        }, 500)
    }, [username, recharge_ticket_id, transaction_id])

    const getList = () => {
        let created_time = ''
        if (date.length > 0) {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        }
        const body = {
            username,
            created_time,
            category_id: categoryId,
            type,
            transaction_id,
            recharge_ticket_id,
            perpage: page.perpage,
            page: page.currentPage
        }
        for (const key of Object.keys(body)) {
            if (body[key] === "") {
                delete body[key];
            }
        }
        if (init > 0) {
            loading(true)
            api(body).then(resp => {
                if (resp.status === 200) {
                    const data = resp.data
                    const pageInfo = {
                        ...page,
                        total: data.totalLogUserBalances,
                    }
                    setPageInfo(pageInfo)
                    setList(resp?.data?.logUserBalanceList || [])
                    setTotalAddedBonus(resp?.data?.totalAddedBonus || 0)
                    setTotalAddedAmount(resp?.data?.totalAddedAmount || 0)

                }
            }).catch(() => message.error('Có lỗi xảy ra khi lấy thông tin đơn hàng'))
                .finally(() => loading(false))
        }
        init++
    }

    return <div className='filter-order'>
        <div className='filter' style={{padding: '0px'}}>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                </div>}>
                    <FilterItem defaultValue={userId}
                                setValue={setUserId}
                                type={'text'}
                                title={'ID người dùng'}
                                allowClear={true}
                    />
                    <FilterItem defaultValue={username}
                                setValue={setUsername}
                                type={'text'}
                                title={'Tên người dùng'}
                                allowClear={true}
                    />
                    <FilterItem defaultValue={transaction_id}
                                setValue={set_transaction_id}
                                type={'text'}
                                title={'Mã giao dịch'}
                                allowClear={true}
                    />
                    <FilterItem defaultValue={recharge_ticket_id}
                                setValue={set_recharge_ticket_id}
                                type={'text'}
                                title={'Mã ticket nạp lỗi'}
                                allowClear={true}
                    />
                    <FilterItem defaultValue={categoryId} setValue={setCategoryId} options={categoryList}
                                type={'select-group'}
                                allowClear={true}
                                title={'Danh mục'}/>
                    <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                    <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                                allowClear={true}
                                title={t('filter.status')}/>
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}