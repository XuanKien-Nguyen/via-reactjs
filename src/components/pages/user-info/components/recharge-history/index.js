import React, {useEffect, useState, Fragment} from "react";
import search from "./components/seach"
import {getAllRechargeSuccess} from "../../../../../services/user";
import TableCommon from "../../../../common/table";
import {Button, Collapse, Icon, message} from "antd";
import FilterItem from "../../../category/components/filter/FilterItem";
import {useTranslation} from "react-i18next";
const { Panel } = Collapse

const dateFormat = 'YYYY-MM-DD';
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

    const { t } = useTranslation()

    useEffect(() => {
        console.log(date)
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
            console.log(resp);
            if(resp.status === 200){
                const data = resp?.data?.successRechargeList || [];
                setData(data)
            }
        }).catch(() => message.error('Có lỗi xảy ra khi lấy lịch sử nạp'))
            .finally(loading(false))
    }, [date, type, JSON.stringify(page), updatedBy, transactionId])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            align: 'center',
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'transaction_id',
            align: 'center',
        },
        {
            title: 'Mã ticket nạp lỗi',
            dataIndex: 'pending_recharge_id',
            align: 'center',
        },
        {
            title: 'Tiền khuyễn mãi',
            dataIndex: 'bonus',
            align: 'center',
        },
        {
            title: 'Tiền tài khoản',
            dataIndex: 'amount',
            align: 'center',
        },
        {
          title: 'Tiền USTD',
          dataIndex: 'usdt_amount',
          align: 'center'
        },
        {
            title: 'USTD/VND',
            dataIndex: 'rate',
            align: 'center',
        },{
            title: 'Loại',
            dataIndex: 'type',
            align: 'center',
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'created_time',
            align: 'center',
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdby',
            align: 'center',
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updated_time',
            align: 'center',
        },
        {
            title: 'QTV cập nhật',
            dataIndex: 'updatedby',
            align: 'center',
        }
    ]

    const onReset = () =>{
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

    const getType = () =>{
        return [{
                label: 'Chọn',
                value: ''
            }, {
                label: 'Banking',
                value: 'banking'
            },{
                label: 'USTD-TRC20',
                value: 'usdt-trc20'
            }]
    }

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

    return <Fragment>
        <div className='product-page filter-order'>
            <div className='filter' style={{padding: '0px'}}>
                <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                    <Panel key={1} className='filter-container' header={<div className='filter-header'>
                        <div><Icon type="filter" theme="filled"/>&nbsp;{''}</div>
                    </div>}>
                        <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>
                        <FilterItem defaultValue={type} setValue={setType} options={getType()} type={'select'}
                                    title={t('filter.status')}/>
                        <FilterItem defaultValue={updatedBy} setValue={setUpdatedBy} options={getType()} type={'text'} title={'Người tạo'}/>
                        <FilterItem defaultValue={transactionId} setValue={setTransactionId} type={'text'} title={'Mã giao dịch'}/>

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