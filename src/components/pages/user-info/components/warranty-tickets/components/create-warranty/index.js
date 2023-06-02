import React, {Fragment, useState} from "react";
import Modal from "antd/es/modal";
import {Button, Icon, Spin} from "antd";
import Form from './components/Form'

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

export default ({visible, setVisible, t}) => {

    const [initDetail, setInitDetail] = useState(false)

    return <Fragment>
        <Modal
            className={'modal-body-80vh'}
            width={'80%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('warranty-tickets.create-warranty')}
            onOk={() => {
            }}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="danger" onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>,
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    {t('common.create')}
                </Button>
            ]}
        >
            <Spin spinning={initDetail} indicator={antIcon}>
                <Form />
            </Spin>
        </Modal>
    </Fragment>
}