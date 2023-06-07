import { Button, Form, Input, message, Select } from 'antd'
import React, { Fragment, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { updatePartner, getPartnerStatusList } from '../../../../../services/partner-manager';
import Modal from "antd/es/modal";
import { useTranslation } from 'react-i18next';

const { Option } = Select

const Wrapper = (props) => {

    const { t } = useTranslation()

    const { getFieldDecorator, setFieldsValue } = props.form;

    const { setVisible, reload, setPending, visible, partner, userRole, loading } = props

    const [statusList, setStatusList] = useState([])

    useEffect(() => {
        getPartnerStatusList().then(resp => {
            const data = resp.data?.STATUS_OBJ || [];
            const lstStatus = []
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: t(`partner_manager.${key}`),
                    value: data[key]
                })
            }
            setStatusList(lstStatus)
        })
    }, [])

    useEffect(() => {
        if (visible) {
            // loading(true)
            // const api = getPartnerById(partnerId)
            // api.then(resp => {
            //     if (resp.status === 200) {
            //         const partnerDetail = resp.data.partnerFound[0];
                    setFieldsValue({
                        username: partner.username,
                        email: partner.email,
                        amount_available: partner.amount_available,
                        domain: partner.domain,
                        api_key: partner.api_key,
                        status: partner.status,
                        comment: partner.comment,
                    })
                }
        //     }).catch(err => Modal.error({
        //         content: err?.response?.data?.message,
        //         onOk: () => {
        //             setVisible(false)
        //         }
        //     })).finally(() => loading(false))
        // }
    }, [visible])

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                let body
                body = {
                    comment: values.comment,
                    status: values.status,
                    domain: values.domain
                }
                setPending(true)
                const api = updatePartner(partner.partner_id, body)
                api.then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp?.data?.message,
                            onOk: () => { }
                        })
                        setVisible(false)
                        reload()
                    }
                }).catch(err => Modal.error({
                    content: err?.response?.data?.message,
                    onOk: () => {}
                }))
                    .finally(() => setPending(false))
            }
        });
    };


    return <Fragment>
        <Form onSubmit={handleSubmit}>
            <Form.Item label="Tên người dùng">
                {getFieldDecorator('username')(
                    <Input type={'text'} placeholder={'Tên người dùng'} disabled />,
                )}
            </Form.Item>
            <Form.Item label="Email">
                {getFieldDecorator('email')(
                    <Input type={'text'} placeholder={'Email'} disabled />,
                )}
            </Form.Item>
            <Form.Item label="Domain">
                {getFieldDecorator('domain', {
                    rules: [{ required: true, message: 'vui lòng nhập domain' }],
                })(
                    <Input type={'text'} placeholder={'Domain'} />,
                )}
            </Form.Item>
            <Form.Item label="API Key">
                {getFieldDecorator('api_key')(
                    <Input type={'text'} placeholder={'API Key'} disabled />,
                )}
            </Form.Item>
            <Form.Item label="Số dư tài khoản">
                {getFieldDecorator('amount_available')(
                    <Input type={'number'} placeholder={'Số dư tài khoản'} disabled />,
                )}
            </Form.Item>
            <Form.Item label="Trạng thái">
                {getFieldDecorator('status', {
                    rules: [{ required: true, message: 'Vui lòng chọn trạng thái' }],
                })(<Select
                    showSearch
                    placeholder="Trạng thái"
                >
                    {statusList.map(el => <Option value={el.value}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>{el.label}</div>
                    </Option>)}
                </Select>)}
            </Form.Item>
            <Form.Item label="Comment">
                {getFieldDecorator('comment', {
                    rules: [{ required: true, message: 'vui lòng nhập Comment' }],
                })(
                    <TextArea placeholder={'Comment'} rows={4} />,
                )}
            </Form.Item>

            <Button id={'submit-update-partner'} type="primary" htmlType="submit" hidden></Button>
        </Form>
    </Fragment>

}

const Wrapped = Form.create()(Wrapper);

export default Wrapped;