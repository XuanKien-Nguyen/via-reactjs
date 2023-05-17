import React, {useState, Fragment} from "react";
import {Button, Form, Icon, Upload} from "antd";
import {createRechargeTickets} from "../../../../../../services/tickets";
import { getBase64 } from "../../../../../../utils/helpers";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal";
import { useTranslation } from "react-i18next";

const Wrapper = (props) => {

    const {getFieldDecorator} = props.form;
    const {setVisible, reload, setPending} = props

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const {t} = useTranslation();

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                let body
                const raw = {
                    recharge_tickets_image: values.recharge_tickets_image[0].originFileObj,
                    content: values.content
                }
                const formData = new FormData()
                Object.keys(raw).forEach(data => formData.append(data, raw[data]))
                body = formData
                setPending(true)
                createRechargeTickets(body).then(resp => {
                    if (resp.status === 201) {
                        Modal.success({
                            content: resp?.data?.message,
                            onOk: () => {}})
                        setVisible(false)
                        reload()
                    }
                }).catch(err => Modal.error({
                        content: err?.response?.data?.message,
                        onOk: () => {}}))
                .finally(() => setPending(false))
            }
        });
    };

    const normFile = e => {
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

    return <Fragment>
        {props.visible && <Form onSubmit={handleSubmit}>
                
                <Form.Item label={t('recharge-tickets.modal-content')}>
                    {getFieldDecorator('content', {
                        rules: [{required: true, message: t('recharge-tickets.modal-content-required')}],
                    })(
                        <TextArea placeholder={t('recharge-tickets.modal-content-placeholder')} rows={4}/>,
                    )}
                </Form.Item>
                <Form.Item label={t('recharge-tickets.modal-image')}>
                    {getFieldDecorator('recharge_tickets_image', {
                        valuePropName: 'fileList',
                        getValueFromEvent: normFile,
                        rules: [{required: true, message: t('recharge-tickets.modal-image-required')}],
                    })(
                        <Upload.Dragger
                            name="files"
                            multiple={false}
                            beforeUpload={() => false}
                            accept={'.png, .jpg'}
                            onPreview={handlePreview}
                            listType="picture"
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">{t('recharge-tickets.modal-image-text')}</p>
                            <p className="ant-upload-hint">{t('recharge-tickets.modal-image-hint')}</p>
                        </Upload.Dragger>,
                    )}
                    <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>
            <Button id={'submit-create-ticket'} type="primary" htmlType="submit" hidden></Button>
        </Form>}
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
