import React from "react";

import {Form, Input, Button} from 'antd';
import {getUserInfo} from "../../../../services/user";

const UserDetail = ({form, user}) => {

    const {getFieldDecorator} = form;
    return <Form>
        <Form.Item disabled label="Tên đầy đủ">
            {getFieldDecorator('fullname', {
                initialValue: user?.fullname || ''
            })(<Input disabled/>)}
        </Form.Item>
        <Form.Item label="Email">
            {getFieldDecorator('email', {
                initialValue: user?.email || ''
            })(<Input disabled/>)}
        </Form.Item>
        <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', {
                initialValue: user?.phone || ''
            })(<Input style={{width: '100%'}} disabled/>)}
        </Form.Item>
        <Form.Item label="Ngày tạo">
            {getFieldDecorator('password', {
                initialValue: user?.created_time || ''
            })(<Input disabled/>)}
        </Form.Item>
    </Form>
}


export default Form.create()(UserDetail);