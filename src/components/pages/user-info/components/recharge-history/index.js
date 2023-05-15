import React, {useEffect, useState, Fragment} from "react";
import Tag from "antd/es/tag";

import {getAllRechargeSuccess} from "../../../../../services/user";
import {getRechargeType} from "../../../../../services/recharge"
import TableCommon from "../../../../common/table";
import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../category/components/filter/FilterItem";
import {useTranslation} from "react-i18next";
import {convertCurrencyVN} from "../../../../../utils/helpers";

const {Panel} = Collapse

const dateFormat = 'YYYY-MM-DD';
const MAP_TYPE = {}

let debounce = null
export default ({loading}) => {

    const [data, setData] = useState([]);
    const [totalRechargeAmount, setTotalRechargeAmount] = useState(0);
    const [totalRechargeBonus, setTotalRechargeBonus] = useState(0);
    const [updatedBy, setUpdatedBy] = useState('')
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })
    const [date, setDate] = useState([])
    const [type, setType] = useState("")
    const [rechargeTypeList, setRechargeTypeList] = useState([])
    const [transactionId, setTransactionId] = useState("")

    const {t} = useTranslation()

    useEffect(() => {
        getRechargeType().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.TYPE_OBJ || []
                const lstType = [{label: 'recharge-type.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstType.push({
                        label: `recharge-type.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `recharge-type.${key}`
                }
                setRechargeTypeList(lstType)
            }
        })
    }, [])

    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            let updated_time = date.length > 0 ? JSON.stringify(date?.map(el => el?.format(dateFormat))) : "";
            let body = {
                updated_time,
                transaction_id: transactionId,
                type,
                page: page.currentPage,
                perpage: page.perpage,
                updatedby: updatedBy
            }

            for (const key of Object.keys(body)) {
                if (body[key] === "") {
                    delete body[key];
                }
            }
            loading(true)
            getAllRechargeSuccess(body).then((resp) => {
                if (resp.status === 200) {
                    const data = resp?.data?.successRechargeList || [];
                    setData(data)
                    const pageInfo = {
                        total: resp?.data?.totalSuccessRecharge,
                        perpage: resp?.data?.perPage,
                        totalPages: resp?.data?.totalPages,
                        currentPage: resp?.data?.currentPage === 0 ? 1 : resp?.data?.currentPage ,
                    }
                    setPage(pageInfo)
                    setTotalRechargeAmount(resp?.data?.toltalAmountSuccessRecharge || 0);
                    setTotalRechargeBonus(resp?.data?.toltalBonusSuccessRecharge || 0);
                }
            }).catch(() => message.error('Có lỗi xảy ra khi lấy lịch sử nạp'))
                .finally(() => loading(false))
        }, 500)
    }, [date, type, page.currentPage, page.perpage, updatedBy, transactionId])

    const renderMoney = (el, prefix = '+') => {
        if (el && (el + '').startsWith('-')) {
            return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
        } else if (el === 0) {
            return <b>0 VND</b>
        }
        return <b style={{color: 'green'}}>{`${prefix}${convertCurrencyVN(el)}`}</b>
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: v => `#${v}`,
            width: '150px',
            align: 'center',
        },
        {
            title: t('recharge.transaction-id'),
            dataIndex: 'transaction_id',
            width: '300px',
            align: 'center',
        },
        {
            title: t('recharge.pending-recharge-id'),
            dataIndex: 'pending_recharge_id',
            width: '300px',
            align: 'center',
        },
        {
            title: t('recharge.bonus'),
            dataIndex: 'bonus',
            width: '200px',
            render: v => renderMoney(v),
            align: 'center',
        },
        {
            title: t('recharge.amount'),
            dataIndex: 'amount',
            width: '200px',
            render: v => renderMoney(v),
            align: 'center',
        },
        {
            title: t('recharge.ustd-amount'),
            dataIndex: 'usdt_amount',
            width: '200px',
            align: 'center'
        },
        {
            title: 'USTD/VND',
            width: '200px',
            dataIndex: 'rate',
            align: 'center',
        }, 
        {
            title: t('recharge.type'),
            width: '200px',
            dataIndex: 'type',
            render: type => <Tag color={type === 'banking' ? 'blue' : 'grey'}>{t(MAP_TYPE[type])}</Tag>,
            align: 'center',
        },
        {
            title: t('recharge.created-time'),
            width: '200px',
            dataIndex: 'created_time',
            align: 'center',
        },
        {
            title: t('recharge.created-by'),
            width: '150px',
            dataIndex: 'createdby',
            align: 'center',
        },
        {
            title: t('recharge.updated-time'),
            dataIndex: 'updated_time',
            width: '200px',
            align: 'center',
        },
        {
            title: t('recharge.updated-by'),
            dataIndex: 'updatedby',
            width: '150px',
            align: 'center',
        }
    ]

    const onReset = () => {
        setType('')
        setUpdatedBy('')
        setDate([])
        setPage({
            perpage: 10,
            currentPage: 1,
            total: 0
        })
        setTransactionId("")
    }

    const getRechargeTypeList = () => {
        return rechargeTypeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const onChangePage = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: currentPage
        })
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: 1
        })
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return <Fragment>
        <div className='filter-order'>
            <div className='filter' style={{padding: '0px', width: '100%', maxWidth: '3000px !important'}}>
                <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                    <Panel key={1} className='filter-container' header={<div className='filter-header'>
                        <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                    </div>}>
                        <FilterItem defaultValue={transactionId} setValue={setTransactionId} type={'text'}
                                    title={t('filter.transaction-id')} allowClear={true}/>
                        <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                        <FilterItem defaultValue={type} setValue={setType} options={getRechargeTypeList()} type={'select'}
                                    title={t('filter.type')}/>
                        <FilterItem defaultValue={updatedBy} setValue={setUpdatedBy} type={'text'} title={t('filter.created-by')}/>

                    </Panel>
                </Collapse>
                <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                        onClick={onReset}>{t('common.reset')}</Button>
            </div>
        </div>
        <div className="recharge-total" style={{marginBottom: '16px', fontSize: '16px'}}>
            <div>{t('recharge-history.total-amount')}: {renderMoney(totalRechargeAmount)}</div>
            <div>{t('recharge-history.total-bonus')}: {renderMoney(totalRechargeBonus)}</div>
        </div>
        <TableCommon className='table-order'
                     bordered={true}
                     rowKey="id"
                     page={page}
                     datasource={data}
                     columns={columns}
                     onChangePage={onChangePage}
                     onChangeSize={onChangeSize}/>
    </Fragment>
}