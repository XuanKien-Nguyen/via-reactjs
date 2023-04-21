import React, {useContext, useState} from 'react';
import { Redirect } from 'react-router-dom';
import store from 'index';
import {Form, Icon, Input, Button, Layout, message} from 'antd';
import '../../../assets/scss/login.scss';

import { useFetch } from '../../../hooks';
import { setAuthorizationToken } from '../../../services/API';
import {login} from "../../../services/user";

function Index({ form }) {
  const { getFieldDecorator } = form;
  const authToken = !!store.get('authenticationToken');
  const {data: { token }} = useFetch();

  const [loading, setLoading] = useState(false)

  if (token) {
    store.set('authenticationToken', token);
    setAuthorizationToken(token);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true)
        login(values).then(resp => {
          if (resp.status === 200 && resp.data) {
            store.set('authenticationToken', 'adadadad');
            message.success("Đăng nhập thành công")
          } else {
            message.error(resp.data.message)
          }
        }).finally(() => setLoading(false))
      }
    })
  };




  return token || authToken ? (
    <Redirect to="/" />
  ) : (
    <Layout className="login-layout">
      <div className='container'>
        <div align="center">
          <h2 className="via2fa-text">VIA2FA</h2>
        </div>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Vui lòng nhập tên tài khoản' }],
            })(
                <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Tên tài khoản"
                />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Vui lòng nhập mật khẩu' }],
            })(
                <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
            Hoặc <a href="">đăng ký tài khoản</a>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default Form.create({ name: 'loginForm' })(Index);
