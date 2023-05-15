import React, {useEffect, useState} from "react";
import {Button, Collapse, Icon, Tag} from "antd";
import {useTranslation} from "react-i18next";
import {getProductList} from "../../../services/product-manager";
import {message} from "antd";
import TableCommon from "../../common/table";
import {convertCurrencyVN} from "../../../utils/helpers";
import FilterItem from "../category/components/filter/FilterItem";

const {Panel} = Collapse
const dateFormat = 'YYYY-MM-DD';
let debounce = null

function Index() {
    const {t} = useTranslation()
    const [productList, setProductList] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [uuid, setUUID] = useState('');
    const [createdTime, setCreatedTime] = useState([])
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })
    const [createdBy, setCreatedBy] = useState('')

    useEffect(() => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            console.log(createdTime);
            const body = {
                category_id: categoryId,
                uuid: uuid,
                createdby: createdBy,
                page: page.currentPage,
                perpage: page.perpage
            }
            for (const key of Object.keys(body)) {
                if (body[key] === "") {
                    delete body[key];
                }
            }

            getProductList(body).then((resp) => {
                console.log(resp);
                console.log(resp.status);
                if (resp.status === 200) {
                    const pageInfo = {
                        total: resp?.data?.totalProducts,
                        perpage: resp?.data?.perpage,
                        totalPages: resp?.data?.totalPages,
                        currentPage: resp?.data?.currentPage === 0 ? 1 : resp?.data?.currentPage,
                    }
                    setPage(pageInfo)
                    setProductList(resp?.data?.listProduct || []);
                }
            }).catch(() => message.error('Có lỗi xảy ra khi lấy sản phẩm')).finally(() => {
            });
        }, 500)

    }, [categoryId, uuid, createdTime, createdBy])

    const onReset = () => {

    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: v => `#${v}`,
            width: '150px',
            align: 'center',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'category_name',
            // render: v => `#${v}`,
            width: '150px',
            align: 'center',
        },
        {
            title: 'UUID',
            dataIndex: 'uid',
            // render: v => `#${v}`,
            width: '150px',
            align: 'center',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            render: v => v === 'not_sold' ? <Tag color="#55acee">Chưa bán</Tag> : <Tag color="#87d068">Đã bán</Tag>,
            width: '150px',
            align: 'center',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'cost',
            render: v => convertCurrencyVN(v),
            width: '150px',
            align: 'center',
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'createdby',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Cập nhật bởi',
            dataIndex: 'updatedby',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_time',
            width: '150px',
            align: 'center',
        }
    ]
    return (
        <div className="filter-order-admin">
            <div className='filter' style={{padding: '0px'}}>
                <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                    <Panel key={1} className='filter-container' header={<div className='filter-header'>
                        <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                    </div>}>
                        {/*{items}*/}

                        <FilterItem defaultValue={categoryId} setValue={setCategoryId} type={'text'}
                                    title='ID danh mục'/>
                        <FilterItem defaultValue={createdTime} setValue={setCreatedTime} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>

                        <FilterItem defaultValue={uuid} setValue={setUUID} type={'text'} title='UUID'/>
                        <FilterItem defaultValue={createdBy} setValue={setCreatedBy} type={'text'} title={t('filter.created-by')}/>

                    </Panel>
                </Collapse>
                <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                        onClick={onReset}>{t('common.reset')}</Button>
            </div>

            <TableCommon className='table-order'
                         bordered={true}
                         rowKey="id"
                         page={page}
                         setPage={setPage}
                         datasource={productList}
                         columns={columns}/>

        </div>

    );
}

export default Index;
