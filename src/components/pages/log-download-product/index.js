import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import {Button, Icon, Tooltip, Tag, message} from "antd";
import { useTranslation } from "react-i18next";
import {getListLogDownloadProduct, getLogDownloadProductTypeManager} from "../../../services/log-download-product";
const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()
    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)
    const [ds, setDs] = useState([])
    const [createdBy, setCreatedBy] = useState('')
    const [type, setType] = useState('')
    const [typeList, setTypeList] = useState([])
    const [createdTime, setCreatedTime] = useState([])

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getLogDownloadProductTypeManager().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.TYPE_OBJ_MANAGER || []
                const lstType = [{label: 'download-type.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstType.push({
                        label: `download-type.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `download-type.${key}`
                }
                setTypeList(lstType)
            }
        }).catch(e => {message.error("Có lỗi xảy ra khi lấy danh sánh kiểu tải về")})
            .finally(() => {setLoading(false)})
    }, [])

    const getTypeList = () => {
        return typeList.map(el => ({
            label: t(el.label),
            value: el.value
        }))
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={createdBy}
                        setValue={setCreatedBy}
                        type={'text'}
                        title={'Người tạo'}
                        allowClear={true} />,
            <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                title={'Loại'} />,

            <FilterItem defaultValue={createdTime} setValue={setCreatedTime} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày cập nhật'} />,
        ]
    }

    const setupSearch = () => {
        let created_time = ''
        if (createdTime.length > 0) {
            created_time = JSON.stringify(createdTime?.map(el => el?.format(dateFormat)))
        }
        const params = {
            createdby: createdBy,
            type,
            created_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getListLogDownloadProduct(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.logDownloadPurchaseList || [])
                    setPage({
                        total: resp.data.totalLogDownloadProducts,
                        perpage: resp.data.perPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                    // setTotalAmount(resp.data.totalSuccessRechargeAmount)
                    // setTotalBonus(resp.data.toltalBonusSuccessRecharge)
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
            render: id => <b>#{id}</b>,
            align: 'center',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            width: '200px',
            align: 'center'
        },
        {
            title: 'Lý do tải xuống',
            width: '200px',
            dataIndex: 'comment',
            align: 'center'
        },
        {
            title: 'Loại',
            width: '150px',
            dataIndex: 'type',
            align: 'center',
            render: type => <b>{t(MAP_TYPE[type])}</b>
        },
        {
            title: 'Người bởi',
            dataIndex: 'createdby',
            width: '100px',
            align: 'center'
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_time',
            width: '100px',
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
            state={[createdBy, type, createdTime]}
            onReset={() => {
                setType('')
                setCreatedBy('')
                setCreatedTime([])
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