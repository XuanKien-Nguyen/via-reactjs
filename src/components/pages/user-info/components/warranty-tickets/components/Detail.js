import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Icon, Spin} from "antd";
import Modal from "antd/es/modal";
import {getComments} from "../../../../../../services/warranty-tickets";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

export default ({id, visible, setVisible, reload}) => {

    const [rechargePendingDetail, setRechargePendingDetail] = useState({})
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()

    useEffect(() => {
        setLoading(true)
        getComments(id).then(resp => {
            console.log('resp', resp);
        }).catch(err => console.log('err', err))
            .finally(() => setLoading(false))
    }, [id])

    return <div>
        <Modal
            className={'modal-body-80vh'}
            width={'80%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('warranty-tickets.detail')}
            onOk={() => {
            }}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="danger" disabled={loading} onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>,
                <Button key="submit" type="primary" disabled={loading} onClick={() => {
                    const submitBtn = document.getElementById('submit-warranty')
                    if (submitBtn) {
                        submitBtn.click()
                    }
                }}>
                    {t('common.create')}
                </Button>
            ]}
        >
            <Spin spinning={loading} indicator={antIcon}>
            </Spin>
        </Modal>
    </div>
}