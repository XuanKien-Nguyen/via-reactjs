import React, {Fragment, useEffect, useState} from "react";
import Search from "./components/Search";
import TableCommon from "../../../../common/table";
import Detail from "./components/Detail";
import {getLogUserBalance, getLogUserBalanceType} from "../../../../../services/user";
import {convertCurrencyVN, getWindowDimensions} from "../../../../../utils/helpers";
import {useTranslation} from "react-i18next";
import {Button, Icon, Tooltip} from "antd";
import './style.scss'
const MAP_TYPE = {}

let fn

export default ({loading}) => {

    const [datasource, setDatasource] = useState([])
    const [detail, setDetail] = useState(null)
    const [visible, setVisible] = useState(false)
    const [withTable, setWidthTable] = useState('81%')

    const { t } = useTranslation()

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    // check width to resize the table
    useEffect(() => {
        fn = () => {
            const currentWidth = getWindowDimensions().width
            if (currentWidth < 950) {
                setWidthTable('100%')
            } else {
                setWidthTable('81%')
            }
        }
        window.addEventListener('resize', fn);
        return () => {
            window.removeEventListener("resize", fn)
        }
    }, [])

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
            width: '100px',
            render: id => <b>#{id}</b>
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            align: 'center',
            width: '150px',
            render: type => <b>{t(MAP_TYPE[type])}</b>
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            width: '350px',
        },
        {
            title: 'Tiền khuyến mãi đã sử dụng',
            dataIndex: 'add_bonus',
            align: 'center',
            width: '150px',
            render: el => {
                if (el && (el + '').startsWith('-')) {
                    return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
                } else if (el === 0) {
                    return <b>0 VND</b>
                }
                return <b style={{color: 'green'}}>{el === 0 ? '0' : `+${convertCurrencyVN(el)}`}</b>
            }
        },
        {
            title: 'Tiền tài khoản đã sử dụng',
            dataIndex: 'add_amount',
            width: '150px',
            align: 'center',
            render: el => {
                if (el && (el + '').startsWith('-')) {
                    return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
                } else if (el === 0) {
                    return <b>0 VND</b>
                }
                return <b style={{color: 'green'}}>{`+${convertCurrencyVN(el)}`}</b>
            }
        },
        {
            title: 'Số dư khuyến mãi',
            dataIndex: 'bonus_remain',
            width: '150px',
            align: 'center',
            render: el => {
                return <b style={{color: 'blue'}}>{convertCurrencyVN(el)}</b>
            }
        },
        {
            title: 'Số dư tài khoản',
            dataIndex: 'amount_remain',
            width: '150px',
            align: 'center',
            render: el => {
                return <b style={{color: 'blue'}}>{convertCurrencyVN(el)}</b>
            }
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdby',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_time',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Thao tác',
            align: 'center',
            width: '80px',
            fixed: 'right',
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
        {/* <div className={'hehe'} style={{width: withTable}}> */}
            <Search setList={setDatasource}
                    api={getLogUserBalance}
                    loading={loading}
                    setPageInfo={setPage}
                    page={page}
                    t={t}
                    getTypeList={getTypeList}
            />
            <TableCommon className='table-order'
                         scroll={{ x: true }}
                         bordered={true}
                         page={page}
                         datasource={datasource}
                         columns={columns}
                // expandedRowRender={expandRender}
                         rowKey="id"
                         onChangePage={onChangePage}
                         onChangeSize={onChangeSize}/>

            <Detail detail={detail} visible={visible} setVisible={setVisible} mapType={MAP_TYPE} t={t}/>
        {/* </div> */}
    </Fragment>
}