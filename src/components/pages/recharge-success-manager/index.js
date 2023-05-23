import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { getAllRechargeSuccess, getTypeListRechargeSuccess } from "../../../services/recharge-manager";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import { Button, Icon, Tooltip, Tag } from "antd";
import { useTranslation } from "react-i18next";

const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()

    const user = useSelector(store => store.user)

    const { setLoading } = useContext(LayoutContext)

    const [ds, setDs] = useState([])
    const [id, setId] = useState('')
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [transactionId, setTransactionId] = useState('')
    const [updatedBy, setUpdatedBy] = useState('')
    const [type, setType] = useState('')
    const [typeList, setTypeList] = useState([])
    const [createdDate, setCreatedDate] = useState([])
    const [updatedDate, setUpdatedDate] = useState([])

    const [totalAmount, setTotalAmount] = useState(0)
    const [totalBonus, setTotalBonus] = useState(0)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getTypeListRechargeSuccess().then(resp => {
            const data = resp.data?.TYPE_OBJ || [];
            const lstStatus = [{ label: 'recharge-type.ALL', value: '' }]
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: `recharge-type.${key}`,
                    value: data[key],
                })
                MAP_TYPE[data[key]] = `recharge-type.${key}`
            }
            setTypeList(lstStatus)
        })
    }, [])

    const getTypeList = () => {
        return typeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={id}
                setValue={setId}
                type={'text'}
                title={'ID'}
                allowClear={true} />,
            <FilterItem defaultValue={userId}
                setValue={setUserId}
                type={'text'}
                title={'User ID'}
                allowClear={true} />,
            <FilterItem defaultValue={username}
                setValue={setUsername}
                type={'text'}
                title={'Tên người dùng'}
                allowClear={true} />,
            <FilterItem defaultValue={email}
                setValue={setEmail}
                type={'text'}
                title={'Email'}
                allowClear={true} />,
            <FilterItem defaultValue={transactionId}
                setValue={setTransactionId}
                type={'text'}
                title={'Mã giao dịch'}
                allowClear={true} />,
            <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                title={'Loại'} />,
            <FilterItem defaultValue={updatedBy}
                setValue={setUpdatedBy}
                type={'text'}
                title={'QTV cập nhật'}
                allowClear={true} />,
            <FilterItem defaultValue={updatedDate} setValue={setUpdatedDate} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày cập nhật'} />,
        ]
    }

    const setupSearch = () => {
        let updated_time = ''
        if (updatedDate.length > 0) {
            updated_time = JSON.stringify(updatedDate?.map(el => el?.format(dateFormat)))
        }
        const params = {
            id,
            user_id: userId,
            username,
            email,
            transaction_id: transactionId,
            type,
            updatedby: updatedBy,
            updated_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getAllRechargeSuccess(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.successRechargeList || [])
                    setPage({
                        total: resp.data.totalSuccessRecharge,
                        perpage: resp.data.perPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                    setTotalAmount(resp.data.totalSuccessRechargeAmount)
                    setTotalBonus(resp.data.toltalBonusSuccessRecharge)
                }
            },
            reject: (err) => console.log(err)
        }
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
            width: '150px',
            fixed: 'left',
            render: id => <b>#{id}</b>,
            align: 'center',
        },
        {
            title: 'User ID',
            dataIndex: 'user_id',
            width: '150px',
            render: userId => <b>#{userId}</b>,
            align: 'center'
        },
        {
            title: 'Username',
            width: '200px',
            dataIndex: 'username',
            align: 'center'
        },
        {
            title: 'Trạng thái',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={status === 'active' ? 'blue' : 'grey'}>{status}</Tag>
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'transaction_id',
            width: '250px',
            render: transaction_id => <b>{transaction_id}</b>,
            align: 'center'
        },
        {
            title: 'Email',
            width: '200px',
            dataIndex: 'email',
            align: 'center'
        },
        {
            title: 'Số dư tài khoản',
            width: '200px',
            dataIndex: 'amount',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Số dư khuyễn mãi',
            width: '200px',
            dataIndex: 'bonus',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Loại',
            width: '150px',
            dataIndex: 'type',
            align: 'center',
            render: type => <Tag color={type === 'banking' ? 'blue' : 'grey'}>{t(MAP_TYPE[type])}</Tag>
        },
        {
            title: 'Người tạo',
            width: '200px',
            dataIndex: 'createdby',
            align: 'center'
        },
        {
            title: 'Thời gian tạo',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Người cập nhật',
            width: '200px',
            dataIndex: 'updatedby',
            align: 'center'
        },
        {
            title: 'Thời gian cập nhật',
            width: '200px',
            dataIndex: 'updated_time',
            align: 'center'
        },
    ]


    return <div>
        {user && <Fragment>
            <Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[id, userId, username, email, transactionId, updatedBy, type, updatedDate]}
            onReset={() => {
                setId('')
                setUserId('')
                setUsername('')
                setEmail('')
                setTransactionId('')
                setType('')
                setUpdatedBy('')
                setUpdatedDate([])
            }}
            page={page} />
            <div style={{marginBottom: '8px', fontWeight: 'bold'}}>
                <div>Tổng tiền tài khoản nạp thành công: {renderMoney(totalAmount)}</div>
                <div>Tổng tiền khuyến mãi nạp thành công: {renderMoney(totalBonus)}</div>
            </div>
            <TableCommon
                className='table-order'
                bordered={true}
                page={page}
                datasource={ds}
                columns={columns}
                rowKey="id"
                onChangePage={onChangePage}
                onChangeSize={onChangeSize}
                scroll={{ x: true }}
            />
        </Fragment>}  
    </div>
}