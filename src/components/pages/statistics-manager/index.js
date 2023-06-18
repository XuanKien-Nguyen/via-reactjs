import React, { useContext, useState, useEffect, Fragment } from "react";
import StatisticCard from './components/StatisticCard';
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { getAllStatistics } from '../../../services/statistics-manager';
import "./index.scss";

const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()
    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)

    const [ds, setDs] = useState(null)

    const [id, setId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [purchaseId, setPurchaseId] = useState('')
    const [purchaseType, setPurchaseType] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [lastestUpdatedBy, setLastestUpdatedBy] = useState('')
    const [createdTime, setCreatedTime] = useState([])
    const [lastestUpdatedTime, setLastestUpdatedTime] = useState([])

    const [reload, setReload] = useState(0)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })


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

    const getItems = () => {
        return [
            <FilterItem defaultValue={categoryId}
                setValue={setCategoryId}
                type={'text'}
                title={'Mã danh mục'}
                allowClear={true} />,
            <FilterItem defaultValue={purchaseId}
                setValue={setPurchaseId}
                type={'text'}
                title={'Mã đơn hàng'}
                allowClear={true} />,
            <FilterItem defaultValue={purchaseType}
                setValue={setPurchaseType}
                type={'text'}
                title={'Loại đơn hàng'}
                allowClear={true} />,
            <FilterItem defaultValue={createdBy}
                setValue={setCreatedBy}
                type={'text'}
                title={'Người tạo'}
                allowClear={true} />,
            <FilterItem defaultValue={lastestUpdatedBy}
                setValue={setLastestUpdatedBy}
                type={'text'}
                title={'Người quyết định'}
                allowClear={true} />,
            <FilterItem defaultValue={createdTime} setValue={setCreatedTime} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày tạo'} />,
                <FilterItem defaultValue={lastestUpdatedTime} setValue={setLastestUpdatedTime} type={'date'}
                placeholder={['Từ ngày', 'Đến ngày']} title={'Chọn ngày cập nhật'} />,
        ]
    }

    const columns = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     width: '150px',
        //     render: id => <b>#{id}</b>,
        //     align: 'center',
        // },
        {
            title: 'Tên sản phẩm',
            width: '200px',
            dataIndex: 'category_name',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'category_id',
            width: '150px',
            align: 'center',
            render: v => <b>#{v}</b>
        },
        {
            title: 'Giá sản phẩm',
            width: '200px',
            dataIndex: 'category_price',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Mã đơn hàng',
            width: '150px',
            dataIndex: 'purchase_id',
            align: 'center'
        },
        {
            title: 'Phương thức mua hàng',
            width: '150px',
            dataIndex: 'purchase_type',
            align: 'center',
            render: v => <b>{v === 'direct' ? 'Trực tiếp' : 'Cộng tác viên'}</b>
        },
        {
            title: 'Tiền khuyến mãi đã sử dụng',
            width: '200px',
            dataIndex: 'bonus_of_buyer_spend',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tiền tài khoản đã sử dụng',
            width: '200px',
            dataIndex: 'amount_of_buyer_spend',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng sản phẩm',
            width: '100px',
            dataIndex: 'total_product',
            align: 'center'
        },
        {
            title: 'Tổng sản phẩm đổi trả',
            width: '100px',
            dataIndex: 'total_product_replace',
            align: 'center'
        },
        {
            title: 'Tổng chi phí',
            width: '200px',
            dataIndex: 'total_cost',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng số dư hoàn trả bảo hành',
            width: '200px',
            dataIndex: 'total_amount_refund_warranty',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng khuyến mãi hoàn trả bảo hành',
            width: '200px',
            dataIndex: 'total_bonus_refund_warranty',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng chi phí đổi trả bảo hành',
            width: '200px',
            dataIndex: 'total_cost_replace_warranty',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng giá',
            width: '200px',
            dataIndex: 'total_price',
            align: 'center',
            render: v => <b>{convertCurrencyVN(v)}</b>
        },
        {
            title: 'Tổng doanh thu',
            width: '200px',
            dataIndex: 'total_profit',
            align: 'center',
            render: v => <b>{renderMoney(v)}</b>
        },
        {
            title: 'Tổng lợi nhuận',
            width: '200px',
            dataIndex: 'final_profit',
            align: 'center',
            render: v => <b>{renderMoney(v)}</b>
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
            dataIndex: 'latest_updatedby',
            align: 'center'
        },
        {
            title: 'Thời gian cập nhật',
            width: '200px',
            dataIndex: 'latest_update_time',
            align: 'center'
        },
    ]

    const setupSearch = () => {
        let created_time = ''
        let latest_update_time = ''
        if (createdTime.length > 0) {
            created_time = JSON.stringify(createdTime?.map(el => el?.format(dateFormat)))
        }
        if (lastestUpdatedTime.length > 0) {
            latest_update_time = JSON.stringify(lastestUpdatedTime?.map(el => el?.format(dateFormat)))
        }
        const params = {
            category_name: categoryId,
            purchase_id: purchaseId,
            purchase_type: purchaseType,
            createdby: createdBy,
            created_time,
            lastest_updatedby: lastestUpdatedBy,
            latest_update_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getAllStatistics(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data || [])
                    setPage({
                        total: resp.data.totalStatistic,
                        perpage: resp.data.perPage,
                        totalPages: resp.data.totalPages,
                        currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage,
                    })
                }
            },
            reject: (err) => console.log(err)
        }
    }

    return <div>
        {user && <Fragment>
            <Search items={getItems()}
                search={setupSearch()}
                loading={setLoading}
                setPage={setPage}
                reload={reload}
                state={[categoryId, purchaseId, purchaseType, createdBy, createdTime, lastestUpdatedBy, lastestUpdatedTime]}
                onReset={() => {
                    setCategoryId('')
                    setPurchaseId('')
                    setPurchaseType('')
                    setCreatedBy('')
                    setCreatedTime([])
                    setLastestUpdatedBy('')
                    setLastestUpdatedTime([])
                }}
                page={page} />
            <StatisticCard items={ds} />
            <Row gutter={[12, 12]}>
                <Col key={'1'} lg={24}>
                    <TableCommon
                        className='table-order'
                        bordered={true}
                        page={page}
                        datasource={ds?.statisticList || []}
                        columns={columns}
                        rowKey="id"
                        onChangePage={onChangePage}
                        onChangeSize={onChangeSize}
                        scroll={{ x: true }}
                    />
                </Col>
            </Row> 
        </Fragment>}
    </div>
}