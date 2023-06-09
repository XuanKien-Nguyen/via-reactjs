import React, { useContext, useState, useEffect, Fragment } from "react";
import Search from "./components/Search";
import FilterItem from "../category/components/filter/FilterItem";
import TableCommon from "../../common/table";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import {Button, Icon, Tooltip, Tag, message, Modal, DatePicker} from "antd";
import { useTranslation } from "react-i18next";
import {getProductRecycleBinList, getProductRecycleBinTypeList, downloadProductCheckpoint, downloadProductError, downloadProductRequest, downloadProductSold} from "../../../services/product-recycle-bin-manager";

const dateFormat = 'YYYY-MM-DD';

const MAP_TYPE = {};

export default () => {

    const { t } = useTranslation()
    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)
    const [ds, setDs] = useState([])
    const [id, setId] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [type, setType] = useState('')
    const [typeList, setTypeList] = useState([])
    const [createdTime, setCreatedTime] = useState([])
    const [downloadTime, setDownloadTime] = useState(null)
    const [visible, setVisible] = useState(false)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const [reload, setReload] = useState(0)

    useEffect(() => {
        getProductRecycleBinTypeList().then(resp => {
            if (resp.status === 200) {
                const data = resp.data?.TYPE_OBJ || []
                const lstType = [{label: 'product_recycle_bin_type.ALL', value: ''}]
                for (const key of Object.keys(data)) {
                    lstType.push({
                        label: `product_recycle_bin_type.${key}`,
                        value: data[key]
                    })
                    MAP_TYPE[data[key]] = `product_recycle_bin_type.${key}`
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

    const onDownloadProduct = (type) => {
        let api;
        if (type === 'checkpoint') {
            api = () => downloadProductCheckpoint()
        } else if (type === 'error') {
            api = () => downloadProductError()
        } else if (type === 'request') {
            api = () => downloadProductRequest()
        }
        api().then(resp => {
            Modal.success({
                content: <div>{resp.data.message}</div>,
                onOk: () => {}
            })
        }).catch(err => {
            Modal.error({
                content: err.response?.data?.message
        })})
    }

    const onDownloadProductSold = () => {
        let created_time = ''
        if (downloadTime) {
            created_time = JSON.stringify(downloadTime.format(dateFormat))
        }
        downloadProductSold({created_time}).then(resp => {
            if (resp.status === 200) {
                Modal.success({
                    content: <div>{resp.data.message}</div>,
                    onOk: () => {}
                })
            }
        }).catch(err => {
            Modal.error({
                content: err.response?.data?.message
        })})
    }

    const getItems = () => {
        return [
            <FilterItem defaultValue={id}
                        setValue={setId}
                        type={'text'}
                        title={'ID'}
                        allowClear={true} />,
            <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
                title={'Loại'} />,
            <FilterItem defaultValue={createdBy}
                        setValue={setCreatedBy}
                        type={'text'}
                        title={'Người tạo'}
                        allowClear={true} />,
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
            id,
            createdby: createdBy,
            type,
            created_time,
            perpage: page.perpage,
            page: page.currentPage,
        }
        return {
            api: () => getProductRecycleBinList(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.productRecycleBinList || [])
                    setPage({
                        total: resp.data.totalProductRecycleBins,
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
            title: 'Loại',
            dataIndex: 'type',
            align: 'center',
            width: '150px',
            render: type => <b>{t(MAP_TYPE[type])}</b>
        },
        {
            title: 'Giá',
            dataIndex: 'cost',
            align: 'center',
            width: '150px',
            render: el => renderMoney(el)
        },
        {
            title: 'Danh mục',
            dataIndex: 'category_name',
            align: 'center',
            width: '200px',
        },
        {
            title: 'ID Đơn hàng',
            dataIndex: 'purchase_id',
            align: 'center',
            width: '200px',
        },
        {
            title: 'ID phiếu bảo hành',
            dataIndex: 'warranty_ticket_id',
            align: 'center',
            width: '200px',
        },       
        {
            title: 'UID',
            align: 'center',
            dataIndex: 'uid',
            width: '200px',
        },
        {
            title: 'Two 2FA',
            align: 'center',
            dataIndex: 'twofa',
            width: '200px',
        },
        {
            title: 'Password Facebook',
            align: 'center',
            dataIndex: 'password_facebook',
            width: '200px',
        },       
        {
            title: 'Cookie',
            align: 'center',
            dataIndex: 'cookie',
            width: '200px',
        },
        {
            title: 'Email Address',
            align: 'center',
            dataIndex: 'email_address',
            width: '200px',
        },
        {
            title: 'Password Email',
            align: 'center',
            dataIndex: 'password_email',
            width: '200px',
        },
        {
            title: 'Recovery Email',
            align: 'center',
            dataIndex: 'recovery_email',
            width: '200px',
        },
        {
            title: 'Facebook Name',
            align: 'center',
            dataIndex: 'fb_name',
            width: '200px',
        },       {
            title: 'Birthday',
            align: 'center',
            dataIndex: 'birthday',
            width: '200px',
        },
        {
            title: 'Created By',
            dataIndex: 'createdby',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Created Time',
            dataIndex: 'created_time',
            width: '150px',
            align: 'center',
        }
    ]


    return <div>
        {user && <Fragment>
            <Search items={getItems()}
            search={setupSearch()}
            loading={setLoading}
            setPage={setPage}
            reload={reload}
            state={[id, createdBy, type, createdTime]}
            onReset={() => {
                setId('')
                setType('')
                setCreatedBy('')
                setCreatedTime([])
            }}
            page={page} />
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px'}}>
                <Button type='primary' onClick={() => {onDownloadProduct('checkpoint')}}><Icon type="download"/>Tải xuống sản phẩm <b> checkpoint</b></Button>
                <Button type='primary' onClick={() => {onDownloadProduct('error')}}><Icon type="download"/>Tải xuống sản phẩm <b> lỗi</b></Button>
                <Button type='primary' onClick={() => {onDownloadProduct('request')}}><Icon type="download"/>Tải xuống sản phẩm <b> đã bảo hành</b></Button>
                <Button type='primary' onClick={() => setVisible(true)}><Icon type="download"/>Tải xuống sản phẩm <b> đã bán</b></Button>
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
        <Modal
                centered
                width={'50%'}
                closable={false}
                visible={visible}
                maskClosable={false}
                title={`Tải xuống sản phẩm đã bán`}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setVisible((false))}>
                        Huỷ bỏ
                    </Button>,
                    <Button key="submit" type="primary" onClick={onDownloadProductSold}>
                        Tải xống
                    </Button>
                ]}>
                <p>Chọn ngày muốn tải:</p>
                <DatePicker 
                    onChange={v => {
                        setDownloadTime(v)
                    }}
                    placeholder={'Chọn ngày'}
                    value={downloadTime}
                    style={{width: '100%'}}
                />
            </Modal>
    </div>
}