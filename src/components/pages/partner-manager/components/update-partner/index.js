import React, {useState} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({loading, visible, setVisible, reload, partnerId}) => {
    const [pending, setPending] = useState(false)
    return <Modal
        className={'update-user'}
        centered
        width={'80%'}
        closable={false}
        visible={visible}
        maskClosable={false}
        title={'Sửa thông tin người dùng'}
        onCancel={() => () => {
            setVisible(false)
        }}
        footer={[
            <Button key="back" disabled={pending} onClick={() => {
                setVisible(false)
            }}>
                Huỷ bỏ
            </Button>,
            <Button key="submit" type="primary" loading={pending} onClick={() => {
                const submitBtn = document.getElementById('submit-update-partner')
                if (submitBtn) {
                    submitBtn.click()
                }
            }}>
                Sửa
            </Button>
        ]}
    >
        <Form setVisible={setVisible}
              reload={reload}
              setPending={setPending}
              visible={visible}
              partnerId={partnerId}
              loading={loading}
        />
    </Modal>
}