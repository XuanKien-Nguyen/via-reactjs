import React, {Fragment, useContext, useEffect, useState} from "react";
import Search from "./components/Search";
import TableCommon from "../../common/table";
import Detail from "./components/Detail";
import {getListBalance} from "../../../services/balance-history-manager";
import {getLogUserBalanceType} from "../../../services/user";
import {convertCurrencyVN} from "../../../utils/helpers";
import {useTranslation} from "react-i18next";
import {Button, Icon, Tooltip} from "antd";
import './style.scss'
import {LayoutContext} from "../../../contexts";

const MAP_TYPE = {}

export default () => {

    const {setLoading} = useContext(LayoutContext)

    const [datasource, setDatasource] = useState([])
    const [type, setType] = useState(null)
    const [detail, setDetail] = useState(null)
    const [visible, setVisible] = useState(false)
    const [totalAddedAmount, setTotalAddedAmount] = useState(0);
    const [totalAddedBonus, setTotalAddedBonus] = useState(0);

    const {t} = useTranslation()

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
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: 1
        })
        window.scrollTo({top: 0, behavior: 'smooth'});
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
            align: 'center',
            width: '100px',
            render: id => <b>#{id}</b>
        },
        {
            title: 'ID - Tên người dùng',
            align: 'center',
            width: '200px',
            render: row => <b>#{row.user_id} - {row.username}</b>
        },
        {
            title: t('balance-history.type'),
            dataIndex: 'type',
            align: 'center',
            width: '150px',
            render: type => <b>{t(MAP_TYPE[type])}</b>
        },
        {
            title: t('balance-history.content'),
            dataIndex: 'content',
            width: '350px',
        },
        {
            title: t('balance-history.add-bonus'),
            dataIndex: 'add_bonus',
            align: 'center',
            width: '150px',
            render: el => renderMoney(el)
        },
        {
            title: t('balance-history.add-amount'),
            dataIndex: 'add_amount',
            width: '150px',
            align: 'center',
            render: el => renderMoney(el)
        },
        {
            title: t('balance-history.bonus-remain'),
            dataIndex: 'bonus_remain',
            width: '150px',
            align: 'center',
            render: el => {
                return <b style={{color: 'blue'}}>{convertCurrencyVN(el)}</b>
            }
        },
        {
            title: t('balance-history.amount-remain'),
            dataIndex: 'amount_remain',
            width: '150px',
            align: 'center',
            render: el => {
                return <b style={{color: 'blue'}}>{convertCurrencyVN(el)}</b>
            }
        },
        {
            title: t('balance-history.created-by'),
            dataIndex: 'createdby',
            width: '150px',
            align: 'center',
        },
        {
            title: t('balance-history.created-time'),
            dataIndex: 'created_time',
            width: '150px',
            align: 'center',
        },
        {
            title: t('balance-history.action'),
            align: 'center',
            width: '80px',
            fixed: 'right',
            render: row => {
                return <div>
                    <Tooltip title={t('order.detail')}>
                        <Button type='primary' onClick={() => onViewDetail(row)}><Icon type="file-search"/></Button>
                    </Tooltip>
                </div>
            }
        },
    ];

    return <Fragment>
        {/* <div className={'hehe'} style={{width: withTable}}> */}
        <Search setList={setDatasource}
                api={getListBalance}
                loading={setLoading}
                setPageInfo={setPage}
                page={page}
                t={t}
                getTypeList={getTypeList}
                type={type}
                setType={setType}
                setTotalAddedAmount={setTotalAddedAmount}
                setTotalAddedBonus={setTotalAddedBonus}
        />
        {type && <div className="balance-total" style={{marginBottom: '16px', fontSize: '16px'}}>
            <div>{t('balance-history.total-amount')}: {renderMoney(totalAddedAmount)}</div>
            <div>{t('balance-history.total-bonus')}: {renderMoney(totalAddedBonus)}</div>
        </div>}
        <TableCommon
            className='table-order'
            scroll={{x: true}}
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