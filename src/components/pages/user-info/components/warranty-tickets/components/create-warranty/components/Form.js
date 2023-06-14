import React, {Fragment, useEffect, useState} from "react";
import {Button, Col, Form, Icon, Row, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal";
import {getBase64, textToFile} from "../../../../../../../../utils/helpers";
import Input from "antd/es/input";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {useSelector} from "react-redux";
import {purchaseList} from "../../../../../../../../services/purchases";
import {createWarrantyTicket} from "../../../../../../../../services/warranty-tickets";

const Wrapper = (props) => {

    const user = useSelector(e => e.user)

    const {getFieldDecorator} = props.form;
    const {loading, setVisible} = props

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [categorySelected, setCategorySelected] = useState(null)

    const [validateStatus, setValidateStatus] = useState('')
    const [helpValidateStatus, setHelpValidateStatus] = useState('')
    const [comment, setComment] = useState('')
    const [errorMsgComment, setErrorMsgComment] = useState('')

    useEffect(() => {
        if (!props.visible) {
            setCategorySelected(null)
            setValidateStatus('')
            setHelpValidateStatus('')
            // props.form.setFieldsValue({uid: ''})
        }
    }, [props.visible])

    const findUid = () => {
        const value = props.form.getFieldValue('uid');
        // const value = '100056771291791'
        if (value) {
            loading(true)
            setValidateStatus('validating')
            purchaseList({uid: value}).then(resp => {
                if (resp.status === 200) {
                    const lst = resp?.data?.newPurchaseList || []
                    if (lst.length === 1) {
                        if (lst[0].status === 'invalid') {
                            setValidateStatus('error');
                            setHelpValidateStatus(`Đơn hàng ${lst[0].category_name} đã hết thời gian bảo hành`)
                            Modal.error({
                                content: `Đơn hàng ${lst[0].category_name} đã hết thời gian bảo hành, vui lòng nhập UID của đơn hàng còn trong thời gian bảo hành`,
                                width: '700px'
                            })
                        } else {
                            setValidateStatus('success');
                            setCategorySelected(lst[0])
                            setHelpValidateStatus('')
                            Modal.success({
                                content: 'Đơn hàng đã chọn: ' + lst[0].category_name
                            })
                        }

                    } else {
                        setValidateStatus('error')
                        setHelpValidateStatus('Không tìm thấy đơn hàng với UID: ' + value)
                        setCategorySelected(null)
                    }
                }
            }).catch(error => {
                setValidateStatus('error')
                setHelpValidateStatus(error?.response?.data?.message)
                setCategorySelected(null)
            }).finally(() => loading(false))
        } else {
            setValidateStatus('error')
            setHelpValidateStatus('Vui lòng nhập UID để tìm kiếm đơn hàng')
            setCategorySelected(null)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categorySelected) {
            findUid()
            return
        }
        props.form.validateFields((err, values) => {
            if (!comment) {
                setErrorMsgComment('Vui lòng nhập mô tả')
            }
            if (!err && comment) {
                const body = {
                    ...values,
                    purchase_id: categorySelected.id,
                    comment
                }
                delete body.warranty_ticket_comment_image
                const formData = new FormData()
                Object.keys(body).forEach(k => {
                    if (body[k]) {
                        formData.append(k, body[k])
                    }
                })
                if (values.warranty_ticket_comment_image) {
                    values.warranty_ticket_comment_image.map(el => formData.append('warranty_ticket_comment_image', el.originFileObj))
                }
                loading(true)
                createWarrantyTicket(formData).then(resp => {
                    if (resp.status === 200) {
                        renderResult(resp.data, true)
                    }
                }).catch(err => renderResult(err?.response?.data, false))
                    .finally(() => loading(false))
            }
        });
    }

    const renderResult = (data, isSuccess) => {
        const p = {
            content: <div>
                <Row>
                    <Row><span>{data.message?.split('-')[0]}</span></Row>
                    <Row className={'m-t-10'}>
                        <Col sm={16} style={{color: 'red'}}>Sản phẩm
                            lỗi: {data.productErrorRequestList?.length || 0}</Col>
                        <Col sm={8}>
                            <a style={{textDecoration: 'underline'}}
                               disabled={data.productErrorRequestList?.length === 0}
                               onClick={() => textToFile('productErrorRequestList', data.productErrorRequestList.join('\r\n'))}
                            >Tải xuống</a>
                        </Col>
                    </Row>
                    <Row className={'m-t-10'}>
                        <Col sm={16}>Sản phẩm trùng: {data.productDuplicateRequestList?.length || 0}</Col>
                        <Col sm={8}>
                            <a style={{textDecoration: 'underline'}}
                               disabled={data.productDuplicateRequestList?.length === 0}
                               onClick={() => textToFile('productDuplicateRequestList', data.productDuplicateRequestList.join('\r\n'))}
                            >Tải xuống</a>
                        </Col>
                    </Row>
                    <Row className={'m-t-10'}>
                        <Col sm={16}>Sản phẩm đã nằm trong yêu cầu
                            khác: {data.productInOtherWarrantyTicket?.length || 0}</Col>
                        <Col sm={8}>
                            <a style={{textDecoration: 'underline'}}
                               disabled={data.productInOtherWarrantyTicket?.length === 0}
                               onClick={() => textToFile('productInOtherWarrantyTicket', data.productInOtherWarrantyTicket.join('\r\n'))}
                            >Tải xuống</a>
                        </Col>
                    </Row>
                    <Row className={'m-t-10'}>
                        <Col sm={16}>Sản phẩm không nằm trong đơn hàng: {data.productNotInPurchase?.length || 0}</Col>
                        <Col sm={8}>
                            <a style={{textDecoration: 'underline'}}
                               disabled={data.productNotInPurchase?.length === 0}
                               onClick={() => textToFile('productInOtherWarrantyTicket', data.productNotInPurchase.join('\r\n'))}
                            >Tải xuống</a>
                        </Col>
                    </Row>
                </Row>
            </div>,
            width: '700px',
            onOk: () => {
                setCategorySelected(null)
                setVisible(false)
                setComment('')
                props.reload()
            }
        }
        if (isSuccess) {
            Modal.success(p)
        } else {
            Modal.error({
                content: data.message,
                width: '700px',
                // onOk: () => {
                // setCategorySelected(null)
                // setVisible(false)
                // setComment('')
                // props.reload()
                // }
            })
        }
    }

    const normFile = e => {
        e.fileList.forEach(el => el.name = '')
        // if (e.fileList.length > 3) {
        //     e.fileList.shift();
        // }
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

    return <Fragment>
        {props.visible && <Form onSubmit={handleSubmit}>
            <Row gutter={10}>
                <Col sm={12}>
                    <p><span style={{color: 'red'}}>*</span>Tài khoản</p>
                    <Input disabled={true} value={user?.username}/>
                </Col>
                <Col sm={12}>
                    <p><span style={{color: 'red'}}>*</span>Email</p>
                    <Input disabled={true} value={user?.email}/>
                </Col>
            </Row>
            <Form.Item
                label={<span><span style={{color: 'red'}}>*</span>Nhập UID để tìm kiếm đơn hàng cần bảo hành</span>}
                hasFeedback
                validateStatus={validateStatus}
                help={helpValidateStatus}>
                {getFieldDecorator('uid')(
                    <div>
                        <Input placeholder={'UID'}/>
                    </div>,
                )}
            </Form.Item>
            <p style={{textAlign: 'center'}}><Button type={'primary'} onClick={findUid}>Tìm kiếm</Button></p>
            {categorySelected && <Fragment>
                <div style={{border: '1px solid #eaeaea', padding: '20px'}}>
                    <h3>Thông tin bảo hành cho đơn hàng <i>#{categorySelected.id} {categorySelected.category_name}</i>
                    </h3>
                    <Form.Item label="Tiêu đề">
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: 'Vui lòng nhập tiêu đề'}],
                        })(
                            <Input placeholder={'Tiêu đề'}/>,
                        )}
                    </Form.Item>
                    <Form.Item label="Danh sách sản phẩm cần bảo hành">
                        {getFieldDecorator('detail', {
                            rules: [{required: true, message: 'Vui lòng nhập danh sách sản phẩm cần bảo hành'}],
                        })(
                            <TextArea placeholder={'Danh sách sản phẩm cần bảo hành'} rows={5}/>,
                        )}
                    </Form.Item>
                    <i>Lưu ý: Mỗi dòng 1 sản phẩm cần bảo hành</i>
                    {/*<Form.Item label="Mô tả">*/}
                    {/*    {getFieldDecorator('comment', {*/}
                    {/*        rules: [{required: true, message: 'Vui lòng nhập mô tả lỗi cho các sản phẩm cần bảo hành'}]*/}
                    {/*    })(*/}
                    {/*        <TextArea placeholder={'Ghi chú'} rows={5}/>,*/}
                    {/*    )}*/}
                    {/*</Form.Item>*/}
                    <p style={{color: 'rgba(0, 0, 0, 0.85)', marginTop: '10px'}}>
                        <span style={{color: 'red'}}>*</span>
                        Mô tả:</p>
                    <CKEditor
                        editor={ClassicEditor}
                        // config={{
                        //     toolbar: [
                        //         'undo', 'redo',
                        //         '|', 'heading',
                        //         '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                        //         '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                        //         '|', 'link', 'blockQuote', 'codeBlock',
                        //         '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent',
                        //         '|', 'alignment',
                        //     ],
                        // }}
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
                                <p className="ant-upload-hint">Tải lên tối đa 3 file, dung lượng tối đa 1MB</p>
                            </Upload.Dragger>
                        )}
                        <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                            <img style={{width: '100%'}} src={previewImage}/>
                        </Modal>
                    </Form.Item>
                </div>
            </Fragment>}
            <Button id={'submit-create-warranty'} type="primary" htmlType="submit" hidden></Button>
        </Form>}
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
