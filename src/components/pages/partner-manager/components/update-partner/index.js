import React, {useState, Fragment, useEffect} from "react";
import Modal from "antd/es/modal";
import {Button} from "antd";
import Form from './form'

export default ({loading, visible, setVisible, reload, partner, setPartner}) => {
    const [pending, setPending] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            if (!visible) {
                setPartner(null)
            }
        }, 300)
    }, [visible])
    return <Fragment>
        {partner && <Modal
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
                    const submitBtn = document.getElementById('submit-update-partner')
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
                  partner={partner}
                  loading={loading}
            />
        </Modal> }
    </Fragment>
}