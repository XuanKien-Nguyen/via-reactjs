import React, {useEffect, useState} from 'react';
import {Button, Form, Icon, Input, Layout, message} from 'antd';
import '../../../assets/scss/login.scss';
import {getUserInfo, login, auth2fa, resetToken} from "../../../services/user";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Modal from "antd/es/modal";
import ForgotPassword from './components/forgot-password'

let timeout_lst = []

function Index({form}) {

    const dispatch = useDispatch()

    const {getFieldDecorator} = form;

    const userInfo = useSelector(store => store.user)

    const history = useHistory();

    const [loading, setLoading] = useState(false)

    const isLogged = localStorage.getItem("is_logged")

    const [visible, setVisible] = useState(false)

    const [errorText, setErrorText] = useState('')

    const [verifying, setVerifying] = useState(false)

    const [verifyExpire, setVerifyExpire] = useState(0)

    const [otp, setOtp] = useState('')

    const [showForgotPassword, setShowForgotPassword] = useState(false)


    useEffect(() => {
        if (!userInfo && isLogged) {
            getUserInfo().then(resp => {
                if (resp.status === 200) {
                    const userFound = resp?.data?.userFound || null
                    dispatch({type: "SET_USER_INFO", payload: userFound})
                    window.location.href = '/'
                }
            })
        }
    }, [])


    const gotoRegister = () => {
        history.push("/register")
    }

    const handleSubmit = async e => {
        e.preventDefault();
        form.validateFields((errors, values) => {
            if (!errors) {
                setLoading(true)
                login(values).then(resp => {
                    if (resp?.status === 200 && resp.data) {
                        message.success("Đăng nhập thành công")
                        dispatch({type: 'SET_USER_INFO', payload: resp.data?.userFound})
                        localStorage.setItem("is_logged", 'true')
                        localStorage.setItem('user_info', JSON.stringify(resp.data?.userFound || {}))
                        window.location.href = '/'
                    } else {
                        message.error(resp?.data?.message || "Error")
                    }
                }).catch(err => {
                    message.error(err?.response?.data?.message || "Error")
                    if (err?.response?.status === 301) {
                        timeout_lst.forEach(el => clearTimeout(el))
                        timeout_lst = []
                        setVisible(true)
                        setVerifyExpire(60);
                    }
                }).finally(() => setLoading(false))
            }
        })
    };

    const onChangeOtp = (e) => {
        setOtp(e.target.value)
        if (!e.target.value) {
            setErrorText('Vui lòng nhập mã OTP')
        } else {
            setErrorText('')
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (verifyExpire !== 0) {
                setVerifyExpire(verifyExpire - 1)
            } else {
                setVisible(false)
                setErrorText('')
                setOtp('')
            }
        }, 1000)

        timeout_lst.push(timeout)
    }, [verifyExpire])

    const handleAuth2fa = async () => {
        if (otp) {
            setVerifying(true)
            auth2fa({otpToken: otp}).then(resp => {
                localStorage.setItem("is_logged", 'true')
                localStorage.setItem('user_info', JSON.stringify(resp.data?.userFound || {}))
                window.location.href = '/'
            }).catch(err => {
                setErrorText(err?.response?.data?.message || 'Lỗi: ' + err)
            }).finally(() => setVerifying(false))
        } else {
            setErrorText('Vui lòng nhập mã OTP')
        }
    }

    return <Layout className="login-layout">
        <div className='container'>
            <div align="center">
                <h2 className="via2fa-text" onClick={() => history.push('/')}>VIA2FA</h2>
            </div>
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Vui lòng nhập tên tài khoản'}],
                    })(
                        <Input autoFocus
                               onPressEnter={handleSubmit}
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Tên tài khoản"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Vui lòng nhập mật khẩu'}],
                    })(
                        <Input
                            onPressEnter={handleSubmit}
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Mật khẩu"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <a className="login-form-forgot" onClick={() => setShowForgotPassword(true)}>
              Quên mật khẩu
            </a>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Đăng nhập
                    </Button>
                    Hoặc <a onClick={gotoRegister}>đăng ký tài khoản</a>
                </Form.Item>
            </Form>
        </div>
        <Modal
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title="Yêu cầu xác thực 2FA"
            onOk={handleAuth2fa}
            onCancel={() => () => {
                setVisible(false)
                setErrorText('')
                setOtp('')
            }}
            footer={[
                <Button key="back" disabled={verifying} onClick={() => {
                    setVisible(false)
                    setErrorText('')
                    setOtp('')
                }}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={verifying} onClick={handleAuth2fa}>
                    Xác thực
                </Button>
            ]}
        >
            <Input autoFocus addonBefore="Mã OTP" value={otp} onChange={onChangeOtp} onPressEnter={handleAuth2fa}/>
            <p style={{margin: '5px', color: 'red'}}>{errorText}</p>
            <p style={{color: 'blue'}}>Thời gian xác thực hết hạn sau {verifyExpire}</p>
        </Modal>
        <ForgotPassword visible={showForgotPassword} setVisible={setShowForgotPassword}/>
    </Layout>
}

export default Form.create({name: 'loginForm'})(Index);
