import React, {Fragment, useState} from "react";
import {Button, Form, Icon, Input, notification} from "antd";
import Modal from "antd/es/modal";
import {changePassword} from "../../../../../services/user";

import { useTranslation } from "react-i18next";

const ChangePassword = (props) => {

    const { t } = useTranslation()

    const [confirmDirty, setConfirmDirty] = useState(false)
    const {getFieldDecorator} = props.form;

    const [openConfirm, setOpenConfirm] = useState(false);

    const [loading, setLoading] = useState(false)

    const handleConfirmBlur = e => {
        const {value} = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    const compareToFirstPassword = (rule, value, callback) => {
        const {form} = props;
        if (value && value !== form.getFieldValue('password')) {
            callback(t('password.error_renew'));
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        const {form} = props;
        if (value && confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    const openModal = () => {
        props.form.validateFields((err) => {
            if (!err) {
                setOpenConfirm(true)
            }
        })
    }

    const executeChangePassword = () => {
        setLoading(true)
        setOpenConfirm(false)
        const data = props.form.getFieldsValue()
        const body = {
            password: data.old_password,
            newPassword: data.password
        }
        changePassword(body).then(resp => {
            Modal.success({
                content: t('password.successful'),
                onOk: () => window.location.href = '/login'
            });
        }).catch(err => {

            const message = err?.response?.data?.message || t('password.fail')
            Modal.error({
                content: message,
                onOk: () => setLoading(false)
            });

        })
    }

    const confirm = () => {
        return <Modal
            title={t('password.title')}
            style={{top: 400}}
            visible={openConfirm}
            onOk={executeChangePassword}
            onCancel={() => setOpenConfirm(false)}
        >{t('password.content')}
        </Modal>
    }

    return <Fragment>
        {confirm()}
        <Form className="login-form">
            <Form.Item label={t('password.current')}>
                {getFieldDecorator('old_password', {
                    rules: [
                        {
                            required: true,
                            message: t('password.required_current'),
                        }
                    ],
                })(<Input.Password
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    // placeholder="Nhập lại mật khẩu mới"
                />)}
            </Form.Item>
            <Form.Item label={t('password.new')} hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: t('password.required_new'),
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    // placeholder="Nhập lại mật khẩu mới"
                />)}
            </Form.Item>
            <Form.Item label={t('password.renew')} hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: t('password.required_renew'),
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur}
                    // placeholder="Nhập lại mật khẩu mới"
                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>)}
            </Form.Item>
            <Form.Item style={{textAlign: 'center'}}>
                <Button style={{width: '144px'}} type="primary" onClick={openModal} className="login-form-button" loading={loading}>
                    {t('password.button')}
                </Button>
            </Form.Item>
        </Form>
    </Fragment>
}

const Result = Form.create()(ChangePassword)

export default () => {
    return <div id="change-password">
        <Result/>
    </div>
}
