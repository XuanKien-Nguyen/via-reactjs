import React, {useEffect, useState, Fragment} from "react";

import {Form, Input, Button, Tag, Table} from 'antd';
import {getLogUserLogin} from "../../../../../services/user";
import { useTranslation } from "react-i18next";

const UserDetail = ({form, user, loading}) => {

    const { t } = useTranslation()

    const [loginList, setLoginList] = useState([])

    const columns = [
        {
            title: 'Thiết bị',
            dataIndex: 'device'
        },
        {
            title: 'Trình duyệt',
            dataIndex: 'browser'
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ip'
        },
        {
            title: 'Khu vực',
            dataIndex: 'location',
            align: 'center',
            render: l => {
                if (l) {
                    return l
                }
                return '-'
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_time'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            render: s => {
                if (s === 'success') {
                    return <Tag color={'#87d068'}>Đăng nhập thành công</Tag>
                }
                return <Tag color={'#f50'}>Đăng nhập thất bại</Tag>
            }
        },
    ]

    useEffect(() =>{
        loading(true)
        getLogUserLogin().then(resp => {
            if (resp.status === 200) {
                setLoginList(resp.data?.logUserLoginList || [])
            }
        }).finally(() => loading(false))
    }, [])

    const {getFieldDecorator} = form;
    return <Fragment>
            <Form>
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
        <h3>Lịch sử đăng nhập (15 lần gần nhất): </h3>
        <Table columns={columns} dataSource={loginList} pagination={false} rowKey={'id'}/>
        </Fragment>
}


export default Form.create()(UserDetail);