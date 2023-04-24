import React, {useState} from 'react';
import {Button, Form, Icon, Input, Layout, message} from 'antd';
import '../../../assets/scss/login.scss';
import {login} from "../../../services/user";
import {useDispatch, useSelector} from "react-redux";

import {useHistory} from "react-router-dom";

function Index({form}) {

    const {getFieldDecorator} = form;

    const history = useHistory();

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const gotoRegister = () => {
        history.push("/register")
    }

    const handleSubmit = async e => {
        e.preventDefault();
        form.validateFields((errors, values) => {
            if (!errors) {
                setLoading(true)
                login(values).then(resp => {
                    console.log(resp);
                    if (resp?.status === 200 && resp.data) {
                        message.success("Đăng nhập thành công")
                        dispatch({type: 'SET_USER_INFO', payload: resp.data?.userFound})
                        history.push("/")
                    } else {
                        message.error(resp?.data?.message || "Error")
                    }
                }).finally(() => setLoading(false))
            }
        })
    };

    return <Layout className="login-layout">
        <div className='container'>
            <div align="center">
                <h2 className="via2fa-text">VIA2FA</h2>
            </div>
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Vui lòng nhập tên tài khoản'}],
                    })(
                        <Input
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
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Mật khẩu"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {/*{getFieldDecorator('remember', {*/}
                    {/*  valuePropName: 'checked',*/}
                    {/*  initialValue: true,*/}
                    {/*})(<Checkbox>Remember me</Checkbox>)}*/}
                    <span className="login-form-forgot" href="">
              Quên mật khẩu
            </span>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                        Đăng nhập
                    </Button>
                    Hoặc <a onClick={gotoRegister}>đăng ký tài khoản</a>
                </Form.Item>
            </Form>
        </div>
    </Layout>
}

export default Form.create({name: 'loginForm'})(Index);
