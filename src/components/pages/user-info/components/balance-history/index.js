import React, {Fragment, useEffect, useState} from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import Detail from "./components/Detail";
import {getLogUserBalance, getLogUserBalanceType} from "../../../../../services/user";
import {convertCurrencyVN} from "../../../../../utils/helpers";
import {useTranslation} from "react-i18next";
import {Button, Icon, Tooltip} from "antd";
import './style.scss'
const MAP_TYPE = {}

export default ({loading}) => {

    const [datasource, setDatasource] = useState([])
    const [detail, setDetail] = useState(null)
    const [visible, setVisible] = useState(false)

    const { t } = useTranslation()

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [lstBalanceType, setLstBalanceType] = useState([])

    useEffect(() => {
        getLogUserBalanceType().then(resp => {
                if (resp.status === 200) {
                    const data = resp.data?.logUserBalanceTypeList || []
                    const lstType = []
                    for (const key of Object.keys(data)) {
                        lstType.push({
                            label: `user-balance-type.${key}`,
                            value: data[key]
                        })
                        MAP_TYPE[data[key]] = `user-balance-type.${key}`
                    }
                    setLstBalanceType(lstType)
                }
            }
        )
    }, [])

    const onViewDetail = row => {
        setDetail(row)
        setVisible(true)
    }

    // useEffect(() => {
    //     if (!visible) {
    //         setDetail(null)
    //     }
    // }, [visible])

    const getTypeList = () => {
        return lstBalanceType.map(el => ({
            label: t(el.label),
            value: el.value
        }))
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            render: id => <b>#{id}</b>
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            align: 'center',
            render: type => <b>{t(MAP_TYPE[type])}</b>
        },
        {
            title: 'Tiền khuyến mãi',
            dataIndex: 'add_bonus',
            align: 'center',
            render: el => {
                if (el && (el + '').startsWith('-')) {
                    return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
                }
                return <b style={{color: 'green'}}>{el === 0 ? '0' : `+${convertCurrencyVN(el)}`}</b>
            }
        },
        {
            title: 'Tiền tài khoản',
            dataIndex: 'add_amount',
            align: 'center',
            render: el => {
                if (el && (el + '').startsWith('-')) {
                    return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
                }
                return <b style={{color: 'green'}}>{el === 0 ? '0' : `+${convertCurrencyVN(el)}`}</b>
            }
        },
        // {
        //     title: 'Số dư tài khoản',
        //     dataIndex: 'amount_remain',
        //     align: 'center',
        //     render: el => {
        //         return <b style={{color: 'green'}}>{convertCurrencyVN(el)}</b>
        //     }
        // },
        // {
        //     title: 'Số dư khuyến mãi',
        //     dataIndex: 'bonus_remain',
        //     align: 'center',
        //     render: el => {
        //         return <b style={{color: 'green'}}>{convertCurrencyVN(el)}</b>
        //     }
        // },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            width: '150px'
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdby',
            align: 'center',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_time',
            align: 'center',
        },
        {
            title: 'Thao tác',
            align: 'center',
            width: '90px',
            render: row => {
                return <div>
                    <Tooltip title={t('order.detail')}>
                        <Button type='primary' onClick={() => onViewDetail(row)}><Icon type="file-search" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ];

    return <Fragment>
        <Search setList={setDatasource}
                api={getLogUserBalance}
                loading={loading}
                setPageInfo={setPage}
                page={page}
                t={t}
                getTypeList={getTypeList}
        />
        <TableCommon className='table-order'
                     bordered={true}
                     page={page}
                     datasource={datasource}
                     columns={columns}
                     // expandedRowRender={expandRender}
                     rowKey="id"
                     onChangePage={onChangePage}
                     onChangeSize={onChangeSize}/>

        <Detail detail={detail} visible={visible} setVisible={setVisible} mapType={MAP_TYPE} t={t}/>
    </Fragment>
}