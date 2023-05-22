import React, {useState} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({loading, visible, setVisible, reload, userDetailId, userRole}) => {
    const [pending, setPending] = useState(false)
    return <Modal
        className={'modal-body-80vh'}
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
                const submitBtn = document.getElementById('submit-update-user')
                if (submitBtn) {
                    submitBtn.click()
                }
            }}>
                Cập nhật
            </Button>
        ]}
    >
        <Form setVisible={setVisible}
              reload={reload}
              setPending={setPending}
              visible={visible}
              userDetailId={userDetailId}
              userRole={userRole}
              loading={loading}
        />
    </Modal>
}