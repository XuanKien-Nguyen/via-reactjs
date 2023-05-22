import React, {useEffect, useState, Fragment} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({loading, visible, setVisible, reload, userDetail, userRole, setUserDetail}) => {
    const [pending, setPending] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            if (!visible) {
                setUserDetail(null)
            }
        }, 300)
    }, [visible])

    return <Fragment>
        {userDetail && <Modal
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
                  userDetail={userDetail}
                  userRole={userRole}
                  loading={loading}
            />
        </Modal>}
    </Fragment>
}