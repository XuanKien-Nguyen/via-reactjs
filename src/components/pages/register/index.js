import {Form, Icon, Input, Button, notification, message} from 'antd';
import React, {useRef} from "react";
import './index.scss'
import SVG from 'react-inlinesvg';
import {checkExistUsername, checkExistEmail, checkExistPhone, register} from "../../../services/user";
import email from '../../../assets/svg/email.svg'
import {useState} from "react";
import {isEmail, isPhoneNumberVN, isUsername} from '../../../utils/helpers'
const debounce = {}

const Register = (props) => {

    const {getFieldDecorator} = props.form;

    const [confirmDirty, setConfirmDirty] = useState(false)
    const [validateUserStatus, setValidateUserStatus] = useState('')
    const [validateEmailStatus, setValidateEmailStatus] = useState('')
    const [validatePhoneStatus, setValidatePhoneStatus] = useState('')
    const [helpValidateUser, setHelpValidateUser] = useState('')
    const [helpValidateEmail, setHelpValidateEmail] = useState('')
    const [helpValidatePhone, setHelpValidatePhone] = useState('')

    const ref = useRef({
        "username": {
            isValid: false,
            count: 0
        },
        "email": {
            isValid: false,
            count: 0
        },
        "phone": {
            isValid: false,
            count: 0
        }
    })

    const validEmail = [{
        func: value => !!value,
        message: 'Vui lòng nhập email'
    },{
        func: isEmail,
        message: 'Vui lòng nhập đúng định dạng email'
    }]

    const validPhone = [
        {
            func: value => !!value,
            message: 'Vui lòng nhập số điện thoại'
        },{
        func: isPhoneNumberVN,
        message: 'Vui lòng nhập đúng định dạng số điện thoại'
    }]
    const validUsername = [{
        func: value => !!value,
        message: 'Vui lòng nhập tên tài khoản'
        },
        {
            func: isUsername,
            message: 'Tên tài khoản chỉ bao gồm chữ, số, gạch dưới và từ 3-15 ký tự'
        }
    ]

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

    const validateCheckExistServer = async (rule, value, callback, setValidateStatus, setMessage, api, fieldName, title, arrFunc) => {
        clearTimeout(debounce[fieldName])
        if (arrFunc) {
            arrFunc.forEach(el => {
                const result = el.func(value)
                if (!result) {
                    ref.current[fieldName] = {
                        isValid: false,
                    }
                    setValidateStatus('error')
                    setMessage(el.message)
                    throw Error('error')
                }
            })
        }
        if (value) {
            setValidateStatus("validating")
            setMessage("")
            debounce[fieldName] = setTimeout(async () => {
                const body = {}
                body[fieldName] = value
                api(body).then(() => {
                    setValidateStatus("success")
                    setMessage("")
                    ref.current[fieldName] = {
                        isValid: true,
                        count: ref.current[fieldName].count + 1
                    }
                    callback()
                }).catch(() => {
                    setValidateStatus("error")
                    setMessage(`${title} đã tồn tại trên hệ thống`)
                    ref.current[fieldName] = {
                        isValid: false,
                        count: ref.current[fieldName].count + 1
                    }
                    callback(`${title} đã tồn tại trên hệ thống`)
                })
            }, 500)
        }
    }

    const handleSubmit = () => {
        const arrInvalid = ['fullname', 'password', 'confirm']
        let validServerIsOk = true
        for(const key in ref.current) {
            const element = ref.current[key]
            if (!element.isValid) {
                if (element.count === 0) {
                    arrInvalid.push(key)
                }
                validServerIsOk = false
            }
        }
        props.form.validateFields(arrInvalid, (err) => {
            if (!err && validServerIsOk) {
                const body = props.form.getFieldsValue();
                delete body.confirm
                register(body).then(() => {
                    message.success("Đăng ký thành công!")
                }).catch(err => {
                    message.success("Đăng ký thất bại, " + err)
                })
            }
        });
    };

    return (<div id="container">
            <div align="center">
                <h2 className="via2fa-text">VIA2FA</h2>
                <h3>Đăng ký thành viên</h3>
            </div>
            <div>
                <Form className="login-form">
                    <Form.Item hasFeedback
                               validateStatus={validateUserStatus}
                               help={helpValidateUser}
                    >
                        {getFieldDecorator('username', {
                            rules: [
                            {
                                validator: (rule, value, callback) => validateCheckExistServer(rule, value, callback,
                                    setValidateUserStatus, setHelpValidateUser, checkExistUsername,
                                    'username', 'Tên tài khoản', validUsername),
                            }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Tên đăng nhập"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('fullname', {
                            rules: [{required: true, message: 'Vui lòng nhập tên đầy đủ', autocomplete: false}],
                        })(
                            <Input
                                prefix={<Icon type="smile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Tên đầy đủ"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item hasFeedback
                               validateStatus={validateEmailStatus}
                               help={helpValidateEmail}
                               >
                        {getFieldDecorator('email', {
                            validateFirst: true,
                            rules: [
                                {
                                    validator: (rule, value, callback) => validateCheckExistServer(rule, value, callback,
                                        setValidateEmailStatus, setHelpValidateEmail,
                                        checkExistEmail, 'email', 'Email', validEmail),
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon component={() => <SVG src={email} width={16}/>}/>}
                                placeholder="Email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item hasFeedback
                               validateStatus={validatePhoneStatus}
                               help={helpValidatePhone}>
                        {getFieldDecorator('phone', {
                            rules: [
                                {  required: true, pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/ },
                                {
                                    validator: (rule, value, callback) => validateCheckExistServer(rule, value, callback,
                                        setValidatePhoneStatus, setHelpValidatePhone, checkExistPhone,
                                        'phone', 'Số điện thoại', validPhone),
                                }
                            ],
                        })(
                            <Input
                                prefix={<Icon type="phone" style={{color: 'rgba(0,0,0,.25)'}}/>}
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
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
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
                                           prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleSubmit} className="login-form-button">
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
        <Result/>
    </div>
}