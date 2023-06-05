import React, {Fragment, useState} from "react";
import Modal from "antd/es/modal";
import {Button, Icon, Spin} from "antd";
import Form from './components/Form'
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

export default ({visible, setVisible, t, reload}) => {

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
                <Button key="submit" type="danger" disabled={initDetail} onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>,
                <Button key="submit" type="primary" disabled={initDetail} onClick={() => {
                    const submitBtn = document.getElementById('submit-create-warranty')
                    if (submitBtn) {
                        submitBtn.click()
                    }
                }}>
                    {t('common.create')}
                </Button>
            ]}
        >
            <Spin spinning={initDetail} indicator={antIcon}>
                <Form visible={visible} loading={setInitDetail} setVisible={setVisible} reload={reload}/>
            </Spin>
        </Modal>
    </Fragment>
}