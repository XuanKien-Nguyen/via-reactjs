import { Form, Icon, Input, Button, notification } from 'antd';
import React from "react";
import './index.scss'
import SVG from 'react-inlinesvg';
import {register} from "../../../services/user";
import email from '../../../assets/svg/email.svg'
import {useState} from "react";

const Register = (props) => {

    const { getFieldDecorator } = props.form;

    const [confirmDirty, setConfirmDirty] = useState(false)
    const [validateUserStatus, setValidateUserStatus] = useState('')
    const [helpValidateUser, setHelpValidateUser] = useState('')

    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty || !!value);
    };

    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Mật khẩu nhập lại không trùng');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    const checkUsername = (rule, value, callback) => {
        console.log(props.form)
        console.log(rule);
        console.log(value);
        console.log(callback);
    }

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // register(values)
            }
        });
    };

    return (<div id="container">
        <div align="center">
            <h2 className="via2fa-text">VIA2FA</h2>
            <h3>Đăng ký thành viên</h3>
        </div>
        <div>
            <Form onSubmit={handleSubmit} className="login-form">
                <Form.Item hasFeedback
                           validateStatus="validating"
                           help="Đang kiểm tra tài khoản tồn tại trên hệ thống">
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Vui lòng nhập tên đăng nhập', autocomplete: false },
                            {
                                validator: checkUsername,
                            }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Tên đăng nhập"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('fullname', {
                        rules: [{ required: true, message: 'Vui lòng nhập tên đầy đủ', autocomplete: false }],
                    })(
                        <Input
                            prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Tên đầy đủ"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ email',
                                autocomplete: false},
                            {
                                type: 'email',
                                message: 'Vui lòng nhập đúng định dạng email',
                            }
                        ],
                    })(
                        <Input
                            prefix={<Icon component={() => <SVG src={email} width={16}/>}  />}
                            placeholder="Email"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Vui lòng nhập số điện thoại', autocomplete: false }],
                    })(
                        <Input
                            prefix={<Icon type="phone" />}
                            placeholder="Số điện thoại"
                        />,
                    )}
                </Form.Item>
                <Form.Item hasFeedback>
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
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Nhập mật khẩu"/>)}
                </Form.Item>
                <Form.Item hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Vui lòng nhập lại mật khẩu',
                            },
                            {
                                validator: compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password onBlur={handleConfirmBlur}
                                       placeholder="Nhập lại mật khẩu"
                                       prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Đăng ký
                    </Button>
                    Đã có tài khoản <a href="">Đăng nhập</a> ngay
                </Form.Item>
            </Form>
        </div>
    </div>

        )
}

const Result = Form.create()(Register)

export default () => {
    return <div id="register-form">
        <Result />
    </div>
}