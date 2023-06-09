import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { getAllRechargeSuccess, getTypeListRechargeSuccess } from "../../../services/recharge-manager";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import {Button, Icon, Tooltip, Tag, message} from "antd";
import { useTranslation } from "react-i18next";
import {getLogDownloadProductType, getLogUserStatus} from "../../../services/user";
import {getListLogDownloadProduct} from "../../../services/log-download-product";
import {getLogUserLogin} from "../../../services/log-user-login";
const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()

    const user = useSelector(store => store.user)

    const { setLoading } = useContext(LayoutContext)

    const [ds, setDs] = useState([])
    const [userId, setUserId] = useState('')
    const [loginStatusList, setLoginStatusList] = useState([])
    const [status, setStatus] = useState('')
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getLogUserStatus().then(resp => {
            if (resp.status === 200) {
                const userLoginStatus = resp.data?.STATUS_OBJ || [];
                let loginStatus = [{label: 'download_type.ALL', value: ''}]
                for (const key of Object.keys(userLoginStatus)) {
                    loginStatus.push({
                        label: `user_login_status.${key}`,
                        value: userLoginStatus[key]
                    })
                    MAP_TYPE[key] = `user_login_status.${key}`
                }
                setLoginStatusList(loginStatus)
            }
        }).catch(e => {message.error("Có lỗi xảy ra khi lấy danh sánh kiểu tải về")})
            .finally(() => {setLoading(false)})
    }, [])

    const getLoginStatusList = () => {
        return loginStatusList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={userId}
                        setValue={setUserId}
                        type={'text'}
                        title={'ID người dùng'}
                        allowClear={true} />,
            <FilterItem defaultValue={status} setValue={setStatus} options={getLoginStatusList()} type={'select'}
                title={'Trạng thái'} />,
        ]
    }

    const setupSearch = () => {
        const params = {
            user_id: userId,
            status,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getLogUserLogin(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.logUserLoginList || [])
                    setPage({
                        total: resp.data.totalLogUserLogins,
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
            ...page,
            perpage: perPage,
            currentPage: currentPage
        })
        setReload(reload+1)
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            ...page,
            perpage: perPage,
            currentPage: 1
        })
        setReload(reload+1)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '150px',
            render: id => <b>#{id}</b>,
            align: 'center',
        },
        {
            title: 'ID người dùng',
            dataIndex: 'user_id',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Trạng thái',
            width: '150px',
            dataIndex: 'status',
            align: 'center',
            render: status => <Tag color={status === 'success' ? '#87d068' : '#f50'}>{status === 'success' ? 'Đăng nhập thành công' : 'Đăng nhập thất bại'}</Tag>
        },
        {
            title: 'Thiết bị',
            width: '200px',
            dataIndex: 'device',
            align: 'center'
        },
        {
            title: 'Trình duyệt',
            width: '200px',
            dataIndex: 'browser',
            align: 'center'
        },
        {
            title: 'Địa chỉ IP',
            width: '200px',
            dataIndex: 'ip_address',
            align: 'center'
        },
        {
            title: 'Thời gian đăng nhập',
            dataIndex: 'created_time',
            width: '200px',
            align: 'center'
        }
    ]


    return <div>
        {user && <Fragment>
            <Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[userId, status]}
            onReset={() => {
                setStatus('')
                setUserId('')
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
        </Fragment>}  
    </div>
}