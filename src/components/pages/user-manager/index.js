import React, { useContext, useState, useEffect, Fragment } from "react";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import Search from './components/Search';
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import UpdateUser from "./components/update-user";
import { getUserListForAdmin, getUserListForStaff, getUserStatusList } from "../../../services/user-manager";
import { convertCurrencyVN } from "../../../utils/helpers";
import { Button, Icon, Tooltip, Tag } from "antd";
import { useTranslation } from "react-i18next";

const dateFormat = 'YYYY-MM-DD';

export default () => {

    const { t } = useTranslation()

    const user = useSelector(store => store.user)

    const { setLoading } = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [userDetailId, setUserDetailId] = useState('')

    const [ds, setDs] = useState([])
    const [id, setId] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    const [statusList, setStatusList] = useState([])
    const [date, setDate] = useState([])

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getUserStatusList().then(resp => {
            const data = resp.data?.STATUS_OBJ || [];
            const lstStatus = [{ label: 'user-manager.ALL', value: '' }]
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: `user-manager.${key}`,
                    value: data[key]
                })
            }
            setStatusList(lstStatus)
        })
    }, [])

    const getStatusList = () => {
        return statusList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const forceReload = () => {
        setReload(reload + 1)
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={id}
                setValue={setId}
                type={'text'}
                title={'ID'}
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
            <FilterItem defaultValue={status} setValue={setStatus} options={getStatusList()} type={'select'}
                title={'Trạng thái'} />,
            <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày tạo'} />
        ]
    }

    const setupSearch = () => {
        let created_time = ''
        if (date.length > 0) {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        }
        const params = {
            id,
            username,
            email,
            status,
            created_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => user?.role === 'admin' ? getUserListForAdmin(params) : getUserListForStaff(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.userList || [])
                    setPage({
                        total: resp.data.totalUsers,
                        perpage: resp.data.perPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
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

    const openModalUpdate = (userId) => {
        setUserDetailId(userId)
        setVisible(true)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '150px',
            render: id => <b>#{id}</b>,
            align: 'center'
        },
        {
            title: 'Role',
            width: '150px',
            dataIndex: 'role',
            align: 'center',
            render: r => <Tag color={r === 'admin' ? 'red' : 'blue'}>{r}</Tag>
        },
        {
            title: 'Username',
            width: '200px',
            dataIndex: 'username',
            align: 'center'
        },
        {
            title: 'Full Name',
            width: '200px',
            dataIndex: 'fullname',
            align: 'center'
        },
        {
            title: 'Email',
            width: '200px',
            dataIndex: 'email',
            align: 'center'
        },
        {
            title: 'Phone number',
            width: '200px',
            dataIndex: 'phone',
            align: 'center'
        },
        {
            title: 'USDT Wallet Address',
            width: '200px',
            dataIndex: 'usdttrc20_wallet_address',
            align: 'center',
            render: val => val ? val : '-'
        },
        {
            title: 'Amount Available',
            width: '200px',
            dataIndex: 'amount_available',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Status',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={status === 'active' ? 'green' : 'red'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
        },
        {
            title: 'Created time',
            width: '200px',
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: 'Lastest updated by',
            width: '200px',
            dataIndex: 'lastest_updatedby',
            align: 'center'
        },
        {
            title: 'Lastest updated time',
            width: '200px',
            dataIndex: 'lastest_updated_time',
            align: 'center'
        },
        {
            title: 'Action',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title='Update'>
                        <Button type='primary' onClick={() => {openModalUpdate(row.id)}}><Icon type="edit" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ]


    return <div>
        {user && <Fragment><Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[id, username, email, status, date]}
            onReset={() => {
                setId('')
                setUsername('')
                setEmail('')
                setStatus('')
                setDate([])
            }}
            page={page} />
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
            <UpdateUser visible={visible}
                    setVisible={setVisible}
                    reload={forceReload}
                    loading={setLoading}
                    userDetailId={userDetailId}
                    userRole={user.role}/>
        </Fragment>}  
    </div>
}