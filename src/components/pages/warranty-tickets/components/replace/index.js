import React, {Fragment, useEffect, useState} from "react";
import {Drawer, Form, Icon, InputNumber, message, Spin, Table, Upload} from "antd";
import Modal from "antd/es/modal";
import {getBase64} from "../../../../../utils/helpers";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
    downloadProductToReplace,
    getProductCheckingList,
    getProductRequestList,
    sendProductToReplace
} from "../../../../../services/warranty-tickets-manager";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";
import ReportError from "./components/ReportError";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const Wrapper = (props) => {

    const {getFieldDecorator} = props.form;
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [productReplaceList, setProductReplaceList] = useState([])
    const [comment, setComment] = useState('')
    const [errorMsgComment, setErrorMsgComment] = useState('')
    const [showReport, setShowReport] = useState(false)
    const [open, setOpen] = useState(false)
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const [quantity, setQuantity] = useState(0)
    const [msgQuantity, setMsgQuantity] = useState('')
    const [visibleDownload, setVisibleDownload] = useState(false)
    const [pendingDownload, setPendingDownload] = useState(false)


    useEffect(() => {
        if (!props.visible) {
            setComment('')
            setErrorMsgComment('')
        }
    }, [props.visible])

    useEffect(() => {
        props.func.execute = handleSubmit
    })

    const handleSubmit = (detail, loading, setVisible, rerender) => {
        props.form.validateFields((err, values) => {
            if (!comment) {
                setErrorMsgComment('Vui lòng nhập nội dung')
            }
            if (!err && comment) {
                const formData = new FormData()
                formData.append('comment', comment)
                formData.append('productSuccessDetail', values.productSuccessDetail)
                if (values.warranty_ticket_comment_image) {
                    values.warranty_ticket_comment_image.map(el => formData.append('warranty_ticket_comment_image', el.originFileObj))
                }
                loading(true)
                sendProductToReplace(detail.id, formData).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp.data.message,
                            onOk: () => {
                                setVisible(false)

                                rerender()
                            }
                        })
                    }
                }).catch(err => Modal.error({
                    content: err.response.data.message,
                }))
                    .finally(() => loading(false))
            }
        });
    }

    const normFile = e => {
        e.fileList.forEach(el => el.name = '')
        if (e.fileList.length > 1) {
            e.fileList.shift();
        }
        return e && e.fileList;
    }

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    }

    const beforeUpload = (file) => {
        const extension = file.name.split('.')

        const errorFn = () => {
            const els = document.querySelector('.ant-upload-list-item-card-actions a i')
            if (els) {
                els.click()
            }
        }
        if (extension.length > 1) {
            const isJpgOrPng = extension[extension.length - 1] === 'jpg' || extension[extension.length - 1] === 'png';
            if (!isJpgOrPng) {
                Modal.error({
                    content: 'Chỉ hỗ trợ định dạng ảnh là JPG và PNG',
                    onOk: errorFn
                });
            }
            if (file.size / 1024 / 1024 > 1) {
                Modal.error({
                    content: 'Kích thước ảnh tối đa là 1Mb',
                    onOk: errorFn
                });
            }
        }
        return false
    }

    const openDrawer = () => {
        setOpen(true)
    }

    useEffect(() => {
        // fetchProductRequest()
        fetchProductRequestChecking()
    }, [])

    const fetchProductRequestChecking = () => {
        setDrawerLoading(true)
        getProductCheckingList(props.detail.id).then(resp => {
            if (resp.status === 200) {
                const data = resp.data.productToReplace
                if (data.length > 0) {
                    const arr = data
                    arr.shift()
                    arr.shift()
                    setProductReplaceList(arr)
                } else {
                    setMsg(resp.data.message)
                }
            }
        }).catch((err) => Modal.error({
            content: err.response.data.message
        })).finally(() => setDrawerLoading(false))
    }

    const fetchProductRequest = () => {
        setDrawerLoading(true)
        getProductRequestList(props.detail.id).then(resp => {
            if (resp.status === 200) {
                console.log(resp);
                const data = resp.data.productRequestList
                data.shift()
                data.shift()
                setProductReplaceList(data)
            }
        }).catch((err) => Modal.error({
            content: err.response.data.message
        })).finally(() => setDrawerLoading(false))
    }

    const fetchDownloadProductToReplace = () => {
        if (!quantity) {
            setMsgQuantity('Vui lòng nhập số lượng')
            return
        }
        setPendingDownload(true)
        downloadProductToReplace(props.detail.id, quantity).then(resp => {
            if (resp.status === 200) {
                Modal.success({
                    content: resp.data.message
                })
            }
        }).catch((err) => Modal.error({
            content: err.response.data.message
        })).finally(() => setPendingDownload(false))
    }

    const onClose = () => {
        setOpen(false)
    }

    const copy = val => {
        message.success('Sao chép thành công')
        navigator.clipboard.writeText(val);
    }

    const getTextBtnSelect = (row) => {
        let v = props.form.getFieldValue('productSuccessDetail') || ''
        console.log('productSuccessDetail', v.split('\r\n'));
        if (v) {
            const arr = v.split('\r\n')
            if (arr.find(el => el === row)) {
                return 'Xoá'
            }
        }
        return "Chọn"
    }

    const getLengthSelected = () => {
        let v = props.form.getFieldValue('productSuccessDetail') || ''
        if (v) {
            return v.split('\r\n').length
        }
        return 0
    }

    const columns = [
        {
            title: 'Sản phẩm',
            width: '600px',
            render: (el, idx) => <b>{idx + 1}</b>
        },
        {
            title: 'Thao tác',
            width: '150px',
            align: 'center',
            render: row => {
                const text = getTextBtnSelect(row)
                return <div>
                    <Button type={text === 'Chọn' ? 'primary' : 'danger'}
                            style={{width: '100px'}}
                            onClick={() => {
                                let v = props.form.getFieldValue('productSuccessDetail') || ''
                                const arr = v.split('\r\n')
                                if (arr.find(el => el === row)) {
                                    const idx = arr.indexOf(row)
                                    arr.splice(idx, 1)
                                } else {
                                    arr.push(row)
                                }
                                props.form.setFieldsValue({
                                    productSuccessDetail: arr.filter(el => el).join('\r\n')
                                })
                            }}>{text}</Button>
                    <Button style={{width: '100px', marginTop: '10px'}} onClick={() => copy(row)}>Sao chép</Button>
                </div>
            }
        }
    ]

    return <Fragment>
        <Drawer
            title="Danh sách sản phẩm đổi trả"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={open}
            width={'50%'}
        >
            <Spin spinning={drawerLoading} indicator={antIcon}>
                <p style={{textAlign: 'right'}}>
                    <Button type={'primary'} onClick={() => setVisibleDownload(true)}>Lấy sản phẩm trong kho</Button>
                </p>
                {productReplaceList.length > 0 ? <div>
                    <p style={{textAlign: 'right'}}>
                        <Button type={'danger'} onClick={() => setShowReport(true)}>Báo lỗi sản phẩm</Button>
                    </p>
                    <b>Tổng số sản phẩm: {productReplaceList.length}</b>
                    <br/>
                    <b>Tổng số sản đã chọn: {getLengthSelected()}</b>
                    <Table
                        dataSource={productReplaceList}
                        pagination={false}
                        columns={columns}/>
                </div> : <p style={{textAlign: 'center'}}><b>{msg}</b></p>}
            </Spin>
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={() => setOpen(false)} type="primary">
                    Đóng
                </Button>
            </div>
        </Drawer>
        <p style={{textAlign: 'right'}}>
            <Button type={'primary'} onClick={openDrawer}>Sản phẩm trong kho</Button>
        </p>
        <Form>
            <div style={{border: '1px solid #eaeaea', padding: '20px'}}>
                <Form.Item label="Danh sách sản phẩm bảo hành">
                    {getFieldDecorator('productSuccessDetail', {
                        initialValue: '',
                        rules: [{required: true, message: 'Vui lòng nhập danh sách sản phẩm bảo hành'}],
                    })(
                        <TextArea disabled={true} placeholder={'Danh sách sản phẩm bảo hành'} rows={8}/>,
                    )}
                </Form.Item>
                <p style={{color: 'rgba(0, 0, 0, 0.85)', marginTop: '10px'}}>
                    <span style={{color: 'red'}}>*</span>
                    Nội dung:</p>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: [
                            'undo', 'redo',
                            '|', 'heading',
                            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|', 'link', 'blockQuote', 'codeBlock',
                            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
                            '|', 'alignment',
                        ],
                    }}
                    data={comment}
                    onReady={editor => {
                        editor.editing.view.change(writer => {
                            writer.setStyle({height: '300px'}, editor.editing.view.document.getRoot())
                        })
                    }}
                    onChange={(evt, editor) => {
                        setErrorMsgComment('')
                        setComment(editor.getData())
                    }}
                />
                <span style={{color: 'red'}}>{errorMsgComment}</span>
                <Form.Item label='Hình ảnh'>
                    {getFieldDecorator('warranty_ticket_comment_image', {
                        valuePropName: 'fileList',
                        getValueFromEvent: normFile,
                        // rules: [{
                        //     required: true,
                        //     message: 'Vui lòng chọn tệp hình ảnh'
                        // }],
                    })(
                        <Upload.Dragger
                            name="files"
                            multiple={true}
                            beforeUpload={beforeUpload}
                            accept={'.png, .jpg'}
                            onPreview={handlePreview}
                            listType="picture"
                            id={'upload-file-category'}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                            <p className="ant-upload-hint">Hỗ trợ định dạng JPG, PNG</p>
                            <p className="ant-upload-hint">Tải lên tối đa 1 file, dung lượng tối đa 1MB</p>
                        </Upload.Dragger>
                    )}
                    <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                        <img style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </Form.Item>
            </div>
        </Form>
        <ReportError visible={showReport}
                     setVisible={setShowReport}
                     detail={props.detail}
        />
        <Modal
            maskClosable={false}
            title="Lấy sản phẩm trong kho"
            visible={visibleDownload}
            closable={false}
            footer={[
                <Button type="danger" disabled={pendingDownload} onClick={() => {
                    setVisibleDownload(false)
                    setMsgQuantity('')
                    setQuantity(0)
                }}>
                    Đóng
                </Button>,
                <Button type="primary" loading={pendingDownload} onClick={fetchDownloadProductToReplace}>
                    Lấy
                </Button>
            ]}
        >
            <p>Số lượng: </p>
            <InputNumber autoFocus={true} style={{width: '100%'}} value={quantity} onChange={e => {
                setQuantity(e)
                setMsgQuantity('')
            }}/>
            {<p style={{color: 'red'}}>{msgQuantity}</p>}
        </Modal>
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
