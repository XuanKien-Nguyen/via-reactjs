import { Button, Form, Input, message, Select } from 'antd'
import React, { Fragment, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getUserByIdForAdmin, getUserByIdForStaff, updateUserForAdmin, updateUserForStaff, getUserStatusList } from '../../../../../services/user-manager';
import Modal from "antd/es/modal";
import { useTranslation } from 'react-i18next';

const { Option } = Select

const Wrapper = (props) => {

    const { t } = useTranslation()

    const { getFieldDecorator, setFieldsValue } = props.form;

    const { setVisible, reload, setPending, visible, userDetail, userRole } = props

    const [statusList, setStatusList] = useState([])

    useEffect(() => {
        getUserStatusList().then(resp => {
            const data = resp.data?.STATUS_OBJ || [];
            const lstStatus = []
            for (const key of Object.keys(data)) {
                lstStatus.push({
                    label: t(`user-manager.${key}`),
                    value: data[key]
                })
            }
            setStatusList(lstStatus)
        })
    }, [])

    useEffect(() => {
        if (visible) {
            // loading(true)
            // const api = userRole === 'staff' ? getUserByIdForAdmin(userDetailId) : getUserByIdForStaff(userDetailId)
            // api.then(resp => {
            //     if (resp.status === 200) {
            //         const userDetail = resp.data.userFound;
                    setFieldsValue({
                        username: userDetail.username,
                        fullname: userDetail.fullname,
                        email: userDetail.email,
                        phone: userDetail.phone,
                        amount_available: userDetail.amount_available,
                        status: userDetail.status
                    })
        //         }
        //     }).catch(err => Modal.error({
        //         content: err?.response?.data?.message,
        //         onOk: () => {
        //             setVisible(false)
        //         }
        //     })).finally(() => loading(false))
        }
    }, [visible])

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                let body
                // const raw = {
                //     fullname: values.fullname,
                //     email: values.email,
                //     phone: values.phone,
                //     amount_available: values.amount_available,
                //     status: values.status,
                //     comment: values.comment
                // }
                // const formData = new FormData()
                // Object.keys(raw).forEach(k => formData.append(k, raw[k]))
                body = values
                setPending(true)
                const api = userRole === 'admin' ? updateUserForAdmin(userDetail.id, body) : updateUserForStaff(userDetail.id, body)
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
            <Form.Item label="Tên đầy đủ">
                {getFieldDecorator('fullname', {
                    rules: [{ required: true, message: 'vui lòng nhập tên đầy đủ' }],
                })(
                    <Input type={'text'} placeholder={'tên đầy đủ'} />,
                )}
            </Form.Item>
            <Form.Item label="Email">
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'vui lòng nhập Email' }],
                })(
                    <Input type={'text'} placeholder={'Email'} />,
                )}
            </Form.Item>
            <Form.Item label="Số điện thoại">
                {getFieldDecorator('phone', {
                    rules: [{ required: true, message: 'vui lòng nhập số điện thoại' }],
                })(
                    <Input type={'number'} placeholder={'số điện thoại'} />,
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

            <Button id={'submit-update-user'} type="primary" htmlType="submit" hidden></Button>
        </Form>
    </Fragment>

}

const Wrapped = Form.create()(Wrapper);

export default Wrapped;