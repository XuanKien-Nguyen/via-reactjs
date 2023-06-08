import React, {Fragment, useEffect, useState} from "react";
import {Form, Icon, Upload} from "antd";
import Modal from "antd/es/modal";
import {getBase64} from "../../../../../utils/helpers";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {sendProductToReplace} from "../../../../../services/warranty-tickets-manager";
import TextArea from "antd/es/input/TextArea";

const Wrapper = (props) => {

    const {getFieldDecorator} = props.form;
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const [comment, setComment] = useState('')
    const [errorMsgComment, setErrorMsgComment] = useState('')

    useEffect(() => {
        if (!props.visible) {
            setComment('')
            setErrorMsgComment('')
        }
    }, [props.visible])

    useEffect(() => {
        // setTimeout(() => {
        props.func.execute = handleSubmit
        // }, 500)
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

    return <Fragment>
        <Form>
            <div style={{border: '1px solid #eaeaea', padding: '20px'}}>
                {/*<h3>{'Tiêu đề'}: <i>{detail.title}</i>*/}
                {/*</h3>*/}
                <Form.Item label="Danh sách sản phẩm bảo hành">
                    {getFieldDecorator('productSuccessDetail', {
                        rules: [{required: true, message: 'Vui lòng nhập danh sách sản phẩm bảo hành'}],
                    })(
                        <TextArea placeholder={'Danh sách sản phẩm bảo hành'} rows={8}/>,
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
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
