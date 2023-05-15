import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Modal from "antd/es/modal";
import { Button, Input, Upload, Icon, message, Form } from 'antd';
import { createRechargeTickets } from "../../../../../../services/tickets";

const { Dragger } = Upload;
const { TextArea } = Input;

let fn

export default ({visible, setVisible, render, setRender}) => {

    const { t } = useTranslation()

    const [pending, setPending] = useState(false)
    const [image, setImage] = useState(null)
    const [content, setContent] = useState('')

    const props = {
        accept: '.jpg,.png',
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        beforeUpload: (file, fileList) => {
            if (image) {
                setImage(null)
            }
        },
        onChange(info) {
            const { status } = info.file;
            if (info.fileList.length > 1) {
                info.fileList.shift();
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                setImage(info.file.originFileObj)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onChangeContent = (e) => {
        setContent(e.target.value);
    }

    const handleCreateTicket = () => {
        setPending(true)

        const formData = new FormData()
        formData.append('recharge_tickets_image', image)
        formData.append('content', content);
        createRechargeTickets(formData).then(resp => {
            if (resp.status === 200) {
                message.success(resp?.data?.message)
            }
            setVisible(false)
        }).catch(err => {
            message.error(err?.response?.data?.message)
        }).finally(() => {
            setRender(render + 1)
            setPending(false)
        })
    }

    return <div className='modal-tickets'>
        <Modal
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('recharge-tickets.modal-title')}
            onOk={() => { }}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="back" disabled={pending} onClick={() => {
                    setVisible(false)
                }}>
                    {t('common.cancel')}
                </Button>,
                <Button key="submit" type="primary" loading={pending} onClick={handleCreateTicket}>
                    {t('common.create')}
                </Button>
            ]}
        >
            <div style={{ marginBottom: '24px' }} >
                <div style={{ marginBottom: '8px' }}>{t('recharge-tickets.modal-content')}</div>
                <TextArea
                value={content}
                onChange={onChangeContent}
                placeholder={t('recharge-tickets.modal-content-placeholder')}
                autoSize={{ minRows: 3, maxRows: 5 }}
                />
            </div>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                You can only upload one file at a time.<br />Only <b>JPG</b> and <b>PNG</b> files are allowed.
                </p>
            </Dragger>
        </Modal>
    </div>
}