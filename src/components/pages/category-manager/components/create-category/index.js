import React, {useState} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({visible, setVisible, reload, updateObject, setUpdateObject}) => {
    const [pending, setPending] = useState(false)

    return <Modal
        className={'modal-body-80vh'}
        centered
        width={'80%'}
        closable={false}
        visible={visible}
        maskClosable={false}
        title={updateObject ? 'Cập nhật danh mục' : 'Thêm mới danh mục'}
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
                {updateObject ? 'Cập nhật' : 'Thêm mới'}
            </Button>
        ]}
    >
        <Form setVisible={setVisible}
              reload={reload}
              setPending={setPending}
              visible={visible}
              updateObject={updateObject}
              setUpdateObject={setUpdateObject}
        />
    </Modal>
}