import React, {useContext, useEffect, useState} from "react";
import {Button, Collapse, Icon, Input, InputNumber, message, Select, Tag, DatePicker} from "antd";
import {useTranslation} from "react-i18next";
import {downloadNotSoldProduct, getProductList} from "../../../services/product-manager";
import TableCommon from "../../common/table";
import {convertCurrencyVN, textToFile} from "../../../utils/helpers";
import FilterItem from "../category/components/filter/FilterItem";
import Modal from "antd/es/modal";
import {getCategoryList} from "../../../services/category/category";
import {LayoutContext} from "../../../contexts";
import Form from "./form";

const {Option, OptGroup} = Select;
const {Panel} = Collapse;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let debounce = null

function Index() {
    const {setLoading} = useContext(LayoutContext);
    const {t} = useTranslation()
    const [productList, setProductList] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [uid, setUid] = useState('');
    const [createdTime, setCreatedTime] = useState([])
    const [pending, setPending] = useState(false)
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })
    const [reload, setReload] = useState(1)
    const [categoryList, setCategoryList] = useState([]);
    const [visible, setVisible] = useState(false)

    const [comment, setComment] = useState('')
    const [downloadCreatedBy, setDownloadCreatedBy] = useState('')
    const [downloadCreatedTime, setDownloadCreatedTime] = useState([])
    const [amount, setAmount] = useState(null)
    const [errorCategorySelect, setErrorCategorySelect] = useState('')

    const [errorComment, setErrorComment] = useState('')
    const [errorAmount, setErrorAmount] = useState('')

    const [createdBy, setCreatedBy] = useState('')

    const [categoryIdSelected, setCategoryIdSelected] = useState(null)
    const [visibleDownload, setVisibleDownload] = useState(false)

    const [sumVia, setSumVia] = useState(0)

    useEffect(() => {
        setCategoryIdSelected(null)
        setDownloadCreatedBy('')
        setDownloadCreatedTime([])
        setAmount(null)
        setComment(null)
        setSumVia(0)
        setErrorComment("")
        setErrorAmount("")
        setErrorCategorySelect("")
    }, [visibleDownload])

    useEffect(() => {
        setLoading(true)
        getCategoryList().then((resp) => {
            if (resp.status === 200) {
                const data = generateCategoryOption(resp?.data?.categoryListFound || [])
                setCategoryList(data);
            }
        }).catch(() => {
            message.error("Có lỗi xảy ra khi lấy danh sách danh mục")
        }).finally(() => {
        })
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }, [])

    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            setLoading(true)
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
                setLoading(false)
            });
        }, 500)


    }, [categoryId, uid, createdTime, createdBy, reload, page.currentPage, page.perpage])

    const onReset = () => {
        setVisible(false)
        setCreatedTime([])
        setCreatedBy('')
        setUid('')
        setCategoryId('')
    }

    const forceReload = () => {
        setReload(reload + 1);
    }
    const generateCategoryOption = (arr) => {
        return arr.map((e) => {
            return {
                label: e.name,
                options: e.childCategoryList?.map((c) => {
                    return {
                        label: c.name,
                        value: c.id,
                        format: c.format,
                        sumVia: c.sum_via
                    }
                }) || []
            }
        })
    }

    const createNewProduct = () => {
        setVisible(true)
    }

    const closePopup = () => {
        setVisible(false)
    }

    const onChangeCategory = (value) => {
        setCategoryId(value)
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

    const getProductNotSoldList = () => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            setPending(true)
            let created_time = downloadCreatedTime.length > 0 ? JSON.stringify(downloadCreatedTime?.map(el => el?.format(dateFormat))) : "";
            let params = {
                category_id: categoryIdSelected,
                createdby: downloadCreatedBy,
                created_time
            }
            getProductList(params).then((resp) => {
                if (resp.status === 200) {
                    const totalVia = resp?.data?.totalProducts || 0
                    setSumVia(totalVia)
                }
            }).catch(() => message.error("Có lỗi xảy ra"))
                .finally(() => setPending(false)) 
    }, 500)}

    useEffect(() => {
        if (categoryIdSelected || downloadCreatedBy || downloadCreatedTime.length > 0) {
            getProductNotSoldList()
        }
    }, [categoryIdSelected, downloadCreatedBy, downloadCreatedTime])

    const handleDownload = () => {
        const allChildren = []
        categoryList.forEach(el => allChildren.push(...el.options))
        const obj = allChildren.find(el => el.value === categoryIdSelected)

        if (!categoryIdSelected) {
            setErrorCategorySelect("Vui chọn danh mục")
        }

        if (!amount) {
            setErrorAmount('Vui lòng nhập số lượng')
        }
        if (!comment) {
            setErrorComment('Vui lòng nhập lý do tải xuống')
        }
        if (amount && comment) {
            setPending(true);
            let created_time = downloadCreatedTime.length > 0 ? JSON.stringify(downloadCreatedTime?.map(el => el?.format(dateFormat))) : "";
            let body = {
                category_id: categoryIdSelected,
                amount: amount,
                comment,
                createdby: downloadCreatedBy,
                created_time
            }
            downloadNotSoldProduct(body).then((resp) => {
                if (resp.status === 200) {
                    if (!resp?.data?.downloadNotSoldList) {
                        Modal.error({
                            content: resp?.data?.message
                        })
                    } else {
                        const content = resp?.data?.downloadNotSoldList?.join('\r\n');
                        textToFile(obj.label + ` - (${amount} via)`, content)
                        setVisibleDownload(false)
                    }
                }
            }).catch(() => message.error("Có lỗi xảy ra"))
                .finally(() => setPending(false))
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: v => `#${v}`,
            width: '100px',
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
            render: v => v === 'not_sold' ? <Tag color="green">Chưa bán</Tag> : <Tag color="red">Đã bán</Tag>,
            width: '50px',
            align: 'center',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'cost',
            render: v => <b>{convertCurrencyVN(v)}</b>,
            width: '150px',
            align: 'center',
        },
        {
            title: 'Chi tiết sản phẩm',
            dataIndex: 'productDetail',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Người tải lên',
            dataIndex: 'createdby',
            width: '150px',
            align: 'center',
        },
        // {
        //     title: 'Cập nhật bởi',
        //     dataIndex: 'updatedby',
        //     width: '150px',
        //     align: 'center',
        // },
        {
            title: 'Ngày tải lên',
            dataIndex: 'created_time',
            width: '150px',
            align: 'center',
        },
        // {
        //     title: 'Ngày cập nhật',
        //     dataIndex: 'updated_time',
        //     width: '150px',
        //     align: 'center',
        // }
        // ,
        // {
        //     title: "Tải xuống",
        //     align: 'center',
        //     // dataIndex: 'id',
        //     width: '150px',
        //     render: row => {
        //         return <div>
        //             <Tooltip title={t('order.download')}>
        //                 <Button type={'danger'}
        //                         onClick={() => {
        //                             setCategoryIdSelected(row.category_id)
        //                             setCategoryNameSelected(row.category_name)
        //                         }}><Icon type="download"/></Button>
        //             </Tooltip>
        //         </div>
        //     }
        //
        // }
    ]
    return (
        <div className="filter-order-admin">
            <div className='filter' style={{padding: '0px'}}>
                <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                    <Panel key={1} className='filter-container' header={<div className='filter-header'>
                        <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                    </div>}>
                        <div className={`filter-item`}>
                            <span>Danh mục</span>
                            <Select allowClear={true} label="Danh mục" defaultValue={""} onChange={onChangeCategory}>
                                {
                                    categoryList.map(e => {
                                        return (
                                            <OptGroup label={e.label}>
                                                {e.options.map(c => {
                                                    return (
                                                        <Option value={c.value}>{c.label}</Option>
                                                    )
                                                })}
                                            </OptGroup>
                                        )

                                    })
                                }
                            </Select>
                        </div>
                        <FilterItem defaultValue={uid} allowClear={true} setValue={setUid} type={'text'} title='UID'/>
                        <FilterItem defaultValue={createdBy} allowClear={true} setValue={setCreatedBy} type={'text'}
                                    title={'Người tải lên'}/>
                        <FilterItem defaultValue={createdTime} setValue={setCreatedTime} type={'date'}
                                    placeholder={[t('filter.from'), t('filter.to')]} title={'Ngày tải lên'}/>

                    </Panel>
                </Collapse>
                <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                        onClick={onReset}>{t('common.reset')}</Button>
            </div>
            <div>
                <p style={{textAlign: 'right'}}>
                    <Button type={'danger'} style={{'marginRight': '5px'}}
                            onClick={() => setVisibleDownload(true)}
                    ><Icon type="download"/> Tải xuống sản phẩm chưa bán</Button>
                    <Button type={'primary'} onClick={createNewProduct}><Icon type="plus"/>{'Thêm mới sản phẩm'}
                    </Button>
                </p>
            </div>

            <TableCommon 
                className='table-order'
                bordered={true}
                rowKey="id"
                page={page}
                // setPage={setPage}
                onChangePage={onChangePage}
                onChangeSize={onChangeSize}
                datasource={productList}
                columns={columns}
                scroll={{ x: true }}
            />

            <Modal
                centered
                width={'50%'}
                closable={false}
                visible={visibleDownload}
                maskClosable={false}
                title={`Tải xuống`}
                onCancel={() => setVisibleDownload(false)}
                footer={[
                    <Button key="back" disabled={pending} onClick={() => setVisibleDownload((false))}>
                        Huỷ bỏ
                    </Button>,
                    <Button key="submit" type="primary" loading={pending} onClick={handleDownload}
                            disabled={sumVia === 0}>
                        Tải xống
                    </Button>
                ]}>
                <div>
                    <p>Chọn danh mục<span style={{color: 'red'}}>*</span></p>
                    <p>
                        <Select placeholder={'Danh mục'} value={categoryIdSelected} style={{width: '100%'}}
                                onChange={e => {
                                    setErrorCategorySelect("");
                                    // const allChildren = []
                                    // categoryList.forEach(el => allChildren.push(...el.options))
                                    // const obj = allChildren.find(el => el.value === e);
                                    // console.log(obj)
                                    // if (obj) {
                                    //     setSumVia(obj.sumVia)
                                    // }

                                    setCategoryIdSelected(e)
                                }}>
                            {
                                categoryList.map(e => <OptGroup label={e.label}>
                                        {e.options.map(c => <Option value={c.value}>{c.label}</Option>)}
                                    </OptGroup>
                                )
                            }
                        </Select>
                    </p>
                    <p style={{color: 'red'}}>{errorCategorySelect}</p>
                </div>
                
                <p>Người tạo:</p>
                <Input 
                    value={downloadCreatedBy}
                    placeholder={'Người tạo'}
                    onChange={v => {
                        const value = v.target.value
                        setDownloadCreatedBy(value)}}
                />
                <p style={{color: 'red'}}></p>

                <p>Ngày tải lên:</p>
                <RangePicker 
                    onChange={v => {
                        setDownloadCreatedTime(v)
                    }}
                    placeholder={['Từ ngày', 'Đến ngày']}
                    value={downloadCreatedTime}
                    style={{width: '100%'}}
                />
                <p style={{color: 'red'}}></p>

                <p>Lý do tải xuống <span style={{color: 'red'}}>*</span>:</p>
                <Input placeholder={'Lý do tải xuống'} value={comment} onChange={v => {
                    const value = v.target.value
                    setComment(value)
                    if (value === '') {
                        setErrorComment('Vui lòng nhập lý do tải xuống')
                    } else {
                        setErrorComment('')
                    }
                }}/>
                <p style={{color: 'red'}}>{errorComment}</p>

                <p className={'m-t-10'}>Số lượng <span style={{color: 'red'}}>*</span>:</p>
                <InputNumber placeholder='Số lượng'
                             style={{width: '100%'}}
                             max={sumVia}
                             type={'number'}
                             min={1} value={amount}
                             disabled={sumVia === 0}
                             onChange={v => {
                                 setAmount(v)
                                 if (!v) {
                                     setErrorAmount('Vui lòng nhập số lượng')
                                 } else {
                                     setErrorAmount('')
                                 }
                             }}/>
                <p style={{marginTop: '15px', color: 'green'}}>Số lượng tối đã có thể tải: {sumVia}</p>
                <p style={{color: 'red'}}>{errorAmount}</p>

            </Modal>

            <Modal
                centered
                width={'70%'}
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
                    <Button key="submit" type="primary" loading={pending} onClick={() => {
                        const submitBtn = document.getElementById('submit-create-product')
                        if (submitBtn) {
                            submitBtn.click()
                        }
                    }}>
                        Thêm mới
                    </Button>
                ]}>
                <Form categoryOptions={categoryList}
                      setReload={forceReload}
                      setPending={setPending}
                      closePopup={closePopup}
                      visible={visible}
                />
            </Modal>

        </div>

    );
}

export default Index;
