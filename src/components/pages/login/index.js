import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import store from 'store';
import { Form, Icon, Input, Button, Layout } from 'antd';
import '../../../assets/scss/login.scss';

import { useFetch } from '../../../hooks';
import { setAuthorizationToken } from '../../../services/API';
import { URLS } from '../../../utils/constants';

function Index({ form }) {
  const { getFieldDecorator, validateFields } = form;
  const authToken = !!store.get('authenticationToken');
  const {
    data: { token },
    doFetch
  } = useFetch();

  if (token) {
    store.set('authenticationToken', token);
    setAuthorizationToken(token);
  }

  const [test, setTest] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const username = form.getFieldValue("userName");
    if (username === 'admin') {
      localStorage.setItem('role', 'admin')
    } else {
      localStorage.setItem('role', 'user')
    }
    store.set('authenticationToken', 'dadadadada');
    setTest(!test)
  };

  return token || authToken ? (
    <Redirect to="/" />
  ) : (
    <Layout className="login-layout">
      <img src={require('../../../assets/img/favicon.png')} alt="" />
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please enter your username!' }]
          })(
            <Input
              prefix={<Icon type="user" className="input-icon" />}
              placeholder="Username"
              size="large"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" className="input-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default Form.create({ name: 'loginForm' })(Index);
