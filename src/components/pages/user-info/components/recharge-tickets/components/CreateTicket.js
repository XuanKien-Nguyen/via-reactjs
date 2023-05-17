import React, {useState} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import FormCreateTickter from './FormCreateTicket'

export default ({loading, visible, setVisible, reload, t}) => {
    const [pending, setPending] = useState(false)
    return <Modal
        className={'create-recharge-ticket'}
        centered
        style={{width: '70%', maxWidth: '700px'}}
        closable={false}
        visible={visible}
        maskClosable={false}
        title={t('recharge-tickets.modal-title')}
        onCancel={() => () => {
            setVisible(false)
        }}
        footer={[
            <Button key="back" disabled={pending} onClick={() => {
                setVisible(false)
            }}>
                {t('common.cancel')}
            </Button>,
            <Button key="submit" type="primary" loading={pending} onClick={() => {
                const submitBtn = document.getElementById('submit-create-ticket')
                if (submitBtn) {
                    submitBtn.click()
                }
            }}>
                {t('common.create')}
            </Button>
        ]}
    >
        <FormCreateTickter setVisible={setVisible}
              reload={reload}
              setPending={setPending}
              visible={visible}
        />
    </Modal>
}