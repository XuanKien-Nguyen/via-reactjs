import React, {useState} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({loading, visible, setVisible, reload}) => {
    const [pending, setPending] = useState(false)
    return <Modal
        centered
        closable={false}
        visible={visible}
        maskClosable={false}
        title={'Thêm mới danh mục'}
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
                const submitBtn = document.getElementById('submit-create-category')
                if (submitBtn) {
                    submitBtn.click()
                }
            }}>
                Thêm mới
            </Button>
        ]}
    >
        <Form setVisible={setVisible}
              reload={reload}
              setPending={setPending}
              visible={visible}
        />
    </Modal>
}