import React, {useEffect, useState} from "react";
import {Button, Collapse, Icon, Tag} from "antd";
import {useTranslation} from "react-i18next";
import {getProductList} from "../../../services/product-manager";
import {message} from "antd";
import TableCommon from "../../common/table";
import {convertCurrencyVN} from "../../../utils/helpers";
import FilterItem from "../category/components/filter/FilterItem";
// import Form from "../category-manager/components/create-category/form";
import Modal from "antd/es/modal";
import {Form, Input, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import {getCategoryList} from "../../../services/category/category";
const { Option } = Select;
const {Panel} = Collapse
const dateFormat = 'YYYY-MM-DD';
function Index() {
    const {t} = useTranslation()
    const [productList, setProductList] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [uid, setUid] = useState('');
    const [createdTime, setCreatedTime] = useState([])
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })
    const [categoryList, setCategoryList] = useState([]);
    const [product, setProduct] = useState({
        category_id: '',
        product_text: '',
        cost: 0
    })

    const [visible, setVisible] = useState(false)
    const [createdBy, setCreatedBy] = useState('')

    useEffect(() => {
        getCategoryList().then((resp) => {
            console.log('category: ', resp);
            if(resp.status === 200){
                setCategoryList(resp?.data?.categoryListFound || []);
            }
        }).catch(() => {

        }).finally(() => {

        })
    }, [])

    useEffect(() => {
        let created_time = createdTime.length > 0 ? JSON.stringify(createdTime?.map(el => el?.format(dateFormat))) : "";
            const body = {
                category_id: categoryId,
                uid,
                created_time,
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
    }, [categoryId, uid, createdTime, createdBy])

    const onReset = () => {

    }

    const getCategoryListOptions = () =>{
        return categoryList.map(el => ({
            label: el.name,
            value: el.id
        }))
    }

    const createNewProduct = () =>{
        setVisible(true)
        return false
    }

    const onChangeCategory = (value) =>{
        console.log(value);
    }

    const handleSubmit = (resp) =>{
        console.log('submit', resp)
    }

    const onFinish = (values) => {
        console.log(values);
    };

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
            width: '150px',
            align: 'center',
        },
        {
            title: 'UID',
            dataIndex: 'uid',
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
                        <FilterItem defaultValue={categoryId} setValue={setCategoryId} options={getCategoryListOptions()} type={'select'}
                                    title='ID danh mục'/>
                        <FilterItem defaultValue={createdTime} setValue={setCreatedTime} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={t('filter.date')}/>

                        <FilterItem defaultValue={uid} setValue={setUid} type={'text'} title='UUID'/>
                        <FilterItem defaultValue={createdBy} setValue={setCreatedBy} type={'text'} title={t('filter.created-by')}/>
                    </Panel>
                </Collapse>
                <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                        onClick={onReset}>{t('common.reset')}</Button>
            </div>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={createNewProduct}>{'Thêm mới sản phẩm'}</Button>
            <TableCommon className='table-order'
                         bordered={true}
                         rowKey="id"
                         page={page}
                         setPage={setPage}
                         datasource={productList}
                         columns={columns}/>


            <Modal
                centered
                width={'50%'}
                closable={false}
                visible={visible}
                maskClosable={false}
                title={'Thêm mới sản phẩm'}
                onCancel={() => () => {
                    setVisible(false)
                }}
                footer={[
                    <Button key="back" disabled={false} onClick={() => {
                        setVisible(false)
                    }}>
                        Huỷ bỏ
                    </Button>,
                    <Button htmlType="submit" type="primary" loading={false}>
                        Thêm mới
                    </Button>
                ]}>

                <Form>
                    <Form.Item name="category_id" rules={[{ required: true , message: 'Vui lòng chọn mã danh mục'}]}>
                        <Select defaultValue={product.category_id}>
                            {getCategoryListOptions().map((el, idx) => <Option key={idx} value={el.value}>{el.label}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="product_text" rules={[{ required: true, message: 'Vui lòng nhâp mã sản phẩm' }]}>
                        <TextArea defaultValue={product.product_text} placeholder="Mã sản phẩm"/>
                    </Form.Item>
                    <Form.Item name="cost" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                        <Input defaultValue={product.cost} type={'number'} placeholder="Giá"/>
                    </Form.Item>
                    <Button onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>

                {/*<Form setVisible={setVisible}*/}
                {/*      reload={reload}*/}
                {/*      setPending={setPending}*/}
                {/*      visible={visible}*/}
                {/*/>*/}
            </Modal>


        </div>

    );
}

export default Index;
