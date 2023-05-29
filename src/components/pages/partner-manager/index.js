import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import { getPartnerStatusList, getPartnerList } from "../../../services/partner-manager";
import { Button, Icon, Tooltip, Tag } from "antd";
import { useTranslation } from "react-i18next";
import UpdatePartner from "./components/update-partner";

const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()

    const user = useSelector(store => store.user)

    const { setLoading } = useContext(LayoutContext)

    const [visible, setVisible] = useState(false)

    const [selectedPartner, setSelectedPartner] = useState(null)

    const [ds, setDs] = useState([])
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [domain, setDomain] = useState('')
    const [decidedBy, setDecidedBy] = useState('')
    const [status, setStatus] = useState('')
    const [statusList, setStatusList] = useState([])
    const [date, setDate] = useState([])
    const [decidedTime, setDecidedTime] = useState([])

    const [totalAmount, setTotalAmount] = useState(0)
    const [totalBonus, setTotalBonus] = useState(0)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getPartnerStatusList().then(resp => {
            const data = resp.data?.STATUS_OBJ || [];
            const lstStatus = [{ label: 'partner-manager.ALL', value: '' }]
            for (const key of Object.keys(data)) {
                
                let color
                if (data[key] === 'active') {
                    color = 'blue'
                } else if (data[key] === 'pending') {
                    color = 'orange'
                } else if (data[key] === 'reject') {
                    color = 'red'
                } else {
                    color = '#AEB6BF'
                }
                lstStatus.push({
                    label: `partner-manager.${key}`,
                    value: data[key],
                })
                MAP_TYPE[data[key]] = {
                    label: `partner-manager.${key}`,
                    value: data[key],
                    color
                }
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
            <FilterItem defaultValue={domain}
                setValue={setDomain}
                type={'text'}
                title={'Domain'}
                allowClear={true} />,
            <FilterItem defaultValue={decidedBy}
                setValue={setDecidedBy}
                type={'text'}
                title={'QTV quyết định'}
                allowClear={true} />,
            <FilterItem defaultValue={status} setValue={setStatus} options={getStatusList()} type={'select'}
                title={'Trạng thái'} />,
            <FilterItem defaultValue={date} setValue={setDate} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày tạo'} />,
            <FilterItem defaultValue={decidedTime} setValue={setDecidedTime} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày quyết định'} />
        ]
    }

    const setupSearch = () => {
        let created_time = ''
        let decided_time = ''
        if (date.length > 0) {
            created_time = JSON.stringify(date?.map(el => el?.format(dateFormat)))
        }
        if (decidedTime.length > 0) {
            decided_time = JSON.stringify(decidedTime?.map(el => el?.format(dateFormat)))
        }
        const params = {
            user_id: userId,
            username,
            email,
            domain,
            decidedby: decidedBy,
            status,
            created_time,
            decided_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getPartnerList(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.partnerList || [])
                    setPage({
                        total: resp.data.totalPartners,
                        perpage: resp.data.perPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                    setTotalAmount(resp.data.totalAmountAvailable)
                    setTotalBonus(resp.data.totalBonusAvailable)
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

    const openModalUpdate = (row) => {
        setSelectedPartner(row)
        setVisible(true)
    }

    const columns = [
        {
            title: 'Partner ID',
            dataIndex: 'partner_id',
            width: '150px',
            render: partner_id => <b>#{partner_id}</b>,
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
            title: 'Trạng thái',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={MAP_TYPE[status]?.color}>{t(MAP_TYPE[status]?.label)}</Tag>
        },
        {
            title: 'Username',
            width: '200px',
            dataIndex: 'username',
            align: 'center'
        },
        {
            title: 'Email',
            width: '200px',
            dataIndex: 'email',
            align: 'center'
        },
        {
            title: 'Domain',
            width: '200px',
            dataIndex: 'domain',
            align: 'center'
        },
        {
            title: 'API Key',
            width: '200px',
            dataIndex: 'api_key',
            align: 'center'
        },
        {
            title: 'Số dư tài khoản',
            width: '200px',
            dataIndex: 'amount_available',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Nội dụng',
            width: '300px',
            dataIndex: 'comment',
            align: 'center'
        },
        {
            title: 'Thời gian đăng ký Cộng tác viên',
            width: '200px',
            dataIndex: 'partner_registration_time',
            align: 'center'
        },
        {
            title: 'Người quyết định',
            width: '200px',
            dataIndex: 'lastest_decidedby',
            align: 'center'
        },
        {
            title: 'Thời gian quyết định',
            width: '200px',
            dataIndex: 'lastest_decided_time',
            align: 'center'
        },
        {
            title: 'Thao tác',
            align: 'center',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title='Cập nhật'>
                        <Button type='primary' onClick={() => {openModalUpdate(row)}}><Icon type="edit" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ]


    return <div>
        {user && <Fragment>
            <Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[userId, username, email, domain, decidedBy, status, date, decidedTime]}
            onReset={() => {
                setUserId('')
                setUsername('')
                setEmail('')
                setDomain('')
                setDecidedBy('')
                setStatus('')
                setDate([])
                setDecidedTime([])
            }}
            page={page} />
            <div style={{marginBottom: '8px', fontWeight: 'bold'}}>
                <div>Tổng số dư tài khoản: {convertCurrencyVN(totalAmount)}</div>
                <div>Tổng số dư khuyến mãi: {convertCurrencyVN(totalBonus)}</div>
            </div>
            <TableCommon
                className='table-order'
                bordered={true}
                page={page}
                datasource={ds}
                columns={columns}
                rowKey="partner_id"
                onChangePage={onChangePage}
                onChangeSize={onChangeSize}
                scroll={{ x: true }}
            />
            <UpdatePartner visible={visible}
                    setVisible={setVisible}
                    reload={forceReload}
                    loading={setLoading}
                    partner={selectedPartner}
                           setPartner={setSelectedPartner}

            />
        </Fragment>}  
    </div>
}