import React, {Fragment, useState} from "react";
import {Button, Form, Icon, Input, notification} from "antd";
import Modal from "antd/es/modal";
import {changePassword} from "../../../../services/user";

const ChangePassword = (props) => {

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
            callback('Mật khẩu nhập lại không trùng');
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
                content: 'Thay đổi mật khẩu thành công, vui lòng đăng nhập lại',
                onOk: () => window.location.href = '/login'
            });
        }).catch(err => {

            const message = err?.response?.data?.message || 'Thay đổi mật khẩu thất bại, có lỗi xảy ra'
            Modal.error({
                content: message,
                onOk: () => setLoading(false)
            });

        })
    }

    const confirm = () => {
        return <Modal
            title="Đổi mật khẩu"
            style={{top: 400}}
            visible={openConfirm}
            onOk={executeChangePassword}
            onCancel={() => setOpenConfirm(false)}
        >Bạn có chắc chắn muốn đổi mật khẩu?
        </Modal>
    }

    return <Fragment>
        {confirm()}
        <Form className="login-form">
            <Form.Item label="Nhập mật khẩu cũ">
                {getFieldDecorator('old_password', {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu cũ',
                        }
                    ],
                })(<Input.Password
                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                    // placeholder="Nhập lại mật khẩu mới"
                />)}
            </Form.Item>
            <Form.Item label="Nhập mật khẩu mới" hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
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
            <Form.Item label="Nhập lại mật khẩu mới" hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu mới',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur}
                    // placeholder="Nhập lại mật khẩu mới"
                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={openModal} className="login-form-button" loading={loading}>
                    Đổi mật khẩu
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
