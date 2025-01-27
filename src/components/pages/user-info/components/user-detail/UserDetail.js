import React, {useEffect, useState, Fragment} from "react";
import TableCommon from '../../../../../components/common/table';
import {Form, Input, Button, Tag, Table} from 'antd';
import {getLogUserLogin, getLogUserStatus} from "../../../../../services/user";
import { useTranslation } from "react-i18next";

const UserDetail = ({form, user, loading}) => {

    const { t } = useTranslation()

    const [loginList, setLoginList] = useState([])
    const [loginStatusList, setLoginStatusList] = useState({})

    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const columns = [
        {
            title: t('info.device'),
            dataIndex: 'device'
        },
        {
            title: t('info.browser'),
            dataIndex: 'browser'
        },
        {
            title: t('info.ip_address'),
            dataIndex: 'ip_address'
        },
        {
            title: t('info.location'),
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
            title: t('info.created_time'),
            dataIndex: 'created_time'
        },
        {
            title: t('info.status'),
            dataIndex: 'status',
            align: 'center',
            render: s => <Tag color={s === 'success' ? '#87d068' : '#f50'}>{t(loginStatusList[s])}</Tag>
        },
    ]

    useEffect(() =>{
        loading(true)
        getLogUserLogin().then(resp => {
            if (resp.status === 200) {
                setLoginList(resp.data?.logUserLoginList || [])
            }
        }).finally(() => loading(false))

        getLogUserStatus().then(resp => {
            if (resp.status === 200) {
                const userLoginStatus = resp.data?.STATUS_OBJ || [];
                const MAP_TYPE = {}
                for (const key of Object.keys(userLoginStatus)) {
                    MAP_TYPE[userLoginStatus[key]] = `user_login_status.${key}`
                }
                setLoginStatusList(MAP_TYPE)
            }
        })
    }, [])

    const onChangePage = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: currentPage
        })
    }

    const onChangeSize = (currentPage, perPage) => {
        setPage({
            perpage: perPage,
            currentPage: 1
        })
    }

    const {getFieldDecorator} = form;
    return <Fragment>
            <Form className="user-info_form">
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
        <h3>{t('info.title_history')}</h3>
        {/* <Table 
            bordered 
            columns={columns} 
            dataSource={loginList} 
            pagination={false} 
            rowKey={'id'} 
            locale={{emptyText: t('common.no_data')}}
            /> */}
        <TableCommon
            className='table-order'
            datasource={loginList}
            bordered={true}
            columns={columns}
            rowKey="id"
            pagination={false}
            page={page}
            onChangePage={onChangePage}
            onChangeSize={onChangeSize}
            scroll={{ x: true }}
        />
        </Fragment>
}


export default Form.create()(UserDetail);