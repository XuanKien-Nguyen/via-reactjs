import React from "react";

import {Form, Input, Button} from 'antd';
import {getUserInfo} from "../../../../../services/user";

import { useTranslation } from "react-i18next";

const UserDetail = ({form, user}) => {

    const { t } = useTranslation()

    const {getFieldDecorator} = form;
    return <Form>
        <Form.Item disabled label={t('info.fullname')}>
            {getFieldDecorator('fullname', {
                initialValue: user?.fullname || ''
            })(<Input disabled/>)}
        </Form.Item>
        <Form.Item label={t('info.email')}>
            {getFieldDecorator('email', {
                initialValue: user?.email || ''
            })(<Input disabled/>)}
        </Form.Item>
        <Form.Item label={t('info.phone')}>
            {getFieldDecorator('phone', {
                initialValue: user?.phone || ''
            })(<Input style={{width: '100%'}} disabled/>)}
        </Form.Item>
        <Form.Item label={t('info.create')}>
            {getFieldDecorator('password', {
                initialValue: user?.created_time || ''
            })(<Input disabled/>)}
        </Form.Item>
    </Form>
}


export default Form.create()(UserDetail);