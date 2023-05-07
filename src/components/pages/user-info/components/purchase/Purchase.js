import React, {useEffect, useState, Fragment} from "react";
import {Badge, message, Table, Button, Icon, Tooltip, Tag} from "antd";
import {purchaseList, downloadPurchase} from "../../../../../services/purchases";
import Modal from "antd/es/modal";
import {convertCurrencyVN, textToFile} from '../../../../../utils/helpers'
import Search from './components/Search'
import TableCommon from '../../../../common/table'
import {useHistory} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default ({loading}) => {

    const { t } = useTranslation()

    const query = new URLSearchParams(window.location.search);

    const history = useHistory()

    const [ds, setDs] = useState([])

    const [visible, setVisible] = useState(false)

     const [productDetail, setProductDetail] = useState(null)

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const columns = [
        {
            title: t('order.id'),
            dataIndex: 'id',
            render: id => `#${id}`,
            align: 'center'
        },
        {
            title: t('order.date'),
            dataIndex: 'created_time',
            align: 'center'
        },
        {
            title: t('order.status'),
            dataIndex: 'status',
            align: 'center',
            render: status => {
                const r = {
                    color: '#f50',
                    text: t('order.valid')
                }
                if (status === 'valid') {
                    r.color = '#87d068'
                    r.text = t('order.invalid')
                }
                return <Tag color={r.color}>{r.text}</Tag>
            }
        },
        {
            title: t('order.total'),
            render: row => {
                return <div>
                    <b>{convertCurrencyVN(row.total_amount)}</b>
                </div>
            }
        },
        {
            title: t('order.action'),
            align: 'center',
            render: row => {
                return <div>
                    <Tooltip title={t('order.detail')}>
                        <Button type='primary' onClick={() => history.push({search: `?menu=${query.get('menu')}&id=${row.id}`})}><Icon type="file-search" /></Button>
                    </Tooltip>
                    <Tooltip title={t('order.download')}>
                        <Button type={'danger'} style={{marginLeft: '10px'}} onClick={() => handleDownload(row.id, row.category_name)}><Icon type="download" /></Button>
                    </Tooltip>
                </div>
            }
        },
    ];

    const handleDownload = (id, categoryName) => {
        loading(true)
        downloadPurchase(id).then(resp => {
            const {data} = resp
            message.success(data.message)
            const content = data.purchaseDownloadList.join('\r\n');
            textToFile(categoryName, content)
        }).catch(err => {
            message.error(err.response?.data?.message || t('order.download-error'))
        }).finally(() => loading(false))
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

    return <Fragment>
        <Search setPurchaseList={setDs} api={purchaseList} loading={loading} setPageInfo={setPage} page={page}/>
        <TableCommon bordered={true} page={page} datasource={ds} columns={columns} rowKey="id" onChangePage={onChangePage} onChangeSize={onChangeSize}/>
        {productDetail && <Modal
            width={'60vw'}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('order.detail-title')}
            onOk={() => {}}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>
            ]}
        >
            <p>Đơn hàng <b>#{productDetail.id}</b> đã được đặt lúc {productDetail.created_time} và hiện tại là <Badge count={productDetail.status === 'valid' ? 'Bảo hành' : 'Hết bảo hành'}
                                                                                                               style={{ backgroundColor: productDetail.status === 'valid' ? '#1890ff' : '#ff4d4f', color: 'white', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
            />
            </p>
        </Modal>}
    </Fragment>

}