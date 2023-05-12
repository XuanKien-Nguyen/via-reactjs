import React, {useEffect, useState, Fragment} from "react";
import Tag from "antd/es/tag";

import {getAllRechargeSuccess} from "../../../../../services/user";
import TableCommon from "../../../../common/table";
import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../category/components/filter/FilterItem";
import {useTranslation} from "react-i18next";
import {convertCurrencyVN} from "../../../../../utils/helpers";

const {Panel} = Collapse

const dateFormat = 'YYYY-MM-DD';

let debounce = null
export default ({loading}) => {

    const [data, setData] = useState([]);
    const [updatedBy, setUpdatedBy] = useState('')
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })
    const [date, setDate] = useState([])
    const [type, setType] = useState("")
    const [transactionId, setTransactionId] = useState("")

    const {t} = useTranslation()

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
            title: 'Mã giao dịch',
            dataIndex: 'transaction_id',
            width: '300px',
            align: 'center',
        },
        {
            title: 'Mã ticket nạp lỗi',
            dataIndex: 'pending_recharge_id',
            width: '300px',
            align: 'center',
        },
        {
            title: 'Tiền khuyễn mãi',
            dataIndex: 'bonus',
            width: '200px',
            render: v => renderMoney(v),
            align: 'center',
        },
        {
            title: 'Tiền tài khoản',
            dataIndex: 'amount',
            width: '200px',
            render: v => renderMoney(v),
            align: 'center',
        },
        {
            title: 'Tiền USTD',
            dataIndex: 'usdt_amount',
            width: '200px',
            align: 'center'
        },
        {
            title: 'USTD/VND',
            width: '200px',
            dataIndex: 'rate',
            align: 'center',
        }, {
            title: 'Loại',
            width: '200px',
            dataIndex: 'type',
            render: v => {
                if (v === 'banking') {
                    return <Tag color={'blue'}>{v.toUpperCase()}</Tag>
                }
                return <Tag color={'grey'}>{v.toUpperCase()}</Tag>
            },
            align: 'center',
        },
        {
            title: 'Thời gian tạo',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center',
        },
        {
            title: 'Tạo bởi',
            width: '150px',
            dataIndex: 'createdby',
            align: 'center',
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updated_time',
            width: '200px',
            align: 'center',
        },
        {
            title: 'QTV cập nhật',
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

    const getType = () => {
        return [{
            label: 'Tất cả',
            value: ''
        }, {
            label: 'Banking',
            value: 'banking'
        }, {
            label: 'USTD-TRC20',
            value: 'usdt-trc20'
        }]
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
            <div className='filter' style={{padding: '0px'}}>
                <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                    <Panel key={1} className='filter-container' header={<div className='filter-header'>
                        <div><Icon type="filter" theme="filled"/>&nbsp;{''}</div>
                    </div>}>
                        <FilterItem defaultValue={transactionId} setValue={setTransactionId} type={'text'}
                                    title={'Mã giao dịch'}/>
                        <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                        <FilterItem defaultValue={type} setValue={setType} options={getType()} type={'select'}
                                    title={t('filter.type')}/>
                        <FilterItem defaultValue={updatedBy} setValue={setUpdatedBy} type={'text'} title={'Người tạo'}/>

                    </Panel>
                </Collapse>
                <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                        onClick={onReset}>{t('common.reset')}</Button>
            </div>
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