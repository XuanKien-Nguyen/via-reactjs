import React, {Fragment, useState} from "react";
import {Button, Form, Icon, Upload, Row, Col} from "antd";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal";
import {getBase64} from "../../../../../../../../utils/helpers";
import Input from "antd/es/input";
import {useSelector} from "react-redux";
import {purchaseList} from "../../../../../../../../services/purchases";

let v = null

const Wrapper = (props) => {

    const user = useSelector(e => e.user)

    const {getFieldDecorator} = props.form;

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [categorySelected, setCategorySelected] = useState(null)
    const [uid, setUdi] = useState('')

    const [validateStatus, setValidateStatus] = useState('')
    const [helpValidateStatus, setHelpValidateStatus] = useState('')

    const findUid = (e) => {
        const value = props.form.getFieldValue('uid');
        if (value) {
            if (v !== value) {
                v = value
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
                })
            }
        } else {
            setValidateStatus('error')
            setHelpValidateStatus('Vui lòng nhập UID để tìm kiếm đơn hàng')
            setCategorySelected(null)
        }

    }

    const handleSubmit = () => {
    }

    const normFile = e => {
        e.fileList.forEach(el => el.name = '')
        if (e.fileList.length > 3) {
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
        <Form onSubmit={handleSubmit}>
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
            <Form.Item label="Nhập UID để tìm kiếm đơn hàng cần bảo hành"
                       hasFeedback
                       validateStatus={validateStatus}
                       help={helpValidateStatus}>
                {getFieldDecorator('uid', {
                    rules: [{required: true, message: 'Vui lòng nhập UID'}],
                })(
                    <div>
                        <Input placeholder={'UID'} onBlur={findUid}/>
                    </div>,
                )}
            </Form.Item>

            {categorySelected && <Fragment>
                <div style={{border: '1px solid #eaeaea', padding: '20px'}}>
                    <h3>Thông tin bảo hành cho đơn hàng <i>#{categorySelected.id} {categorySelected.category_name}</i></h3>
                    <Form.Item label="Tiêu đề">
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: 'Vui lòng nhập tiêu đề'}],
                        })(
                            <Input placeholder={'Tiêu đề'}/>,
                        )}
                    </Form.Item>
                    <Form.Item label="Danh sách đơn hàng cần bảo hành">
                        {getFieldDecorator('detail', {
                            rules: [{required: true, message: 'Vui lòng nhập danh sách đơn hàng cần bảo hành'}],
                        })(
                            <TextArea placeholder={'Mô tả'} rows={5}/>,
                        )}
                    </Form.Item>
                    <i>Lưu ý: Mỗi dòng 1 sản phẩm</i>
                    <Form.Item label='Hình ảnh'>
                        {getFieldDecorator('category_image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                            rules: [{
                                required: true,
                                message: 'Vui lòng chọn tệp hình ảnh'
                            }],
                        })(
                            <Upload.Dragger
                                name="files"
                                multiple={false}
                                beforeUpload={beforeUpload}
                                accept={'.png, .jpg'}
                                onPreview={handlePreview}
                                // disabled={props.form.getFieldValue('category_image')?.length > 0 || false}
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
                    <Form.Item label="Ghi chú">
                        {getFieldDecorator('comment', {
                            rules: [{required: true, message: 'Vui lòng nhập ghi chú'}],
                        })(
                            <TextArea placeholder={'Ghi chú'} rows={5}/>,
                        )}
                    </Form.Item>
                </div>
            </Fragment>}
        </Form>
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
