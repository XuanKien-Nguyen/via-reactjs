import React, {Fragment, useState} from "react";
import Modal from "antd/es/modal";
import {Button, Icon, Spin} from "antd";
import ReplyComment from "./components/ReplyComment";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

export default ({visible, setVisible, t, rerender, detail}) => {

    const [initDetail, setInitDetail] = useState(false)

    return <Fragment>
        <Modal
            className={'modal-body-80vh'}
            width={'90%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('warranty_tickets.create_comment_warranty') + ' #' + detail.id}
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
                    const submitBtn = document.getElementById('submit-create-comment-warranty')
                    if (submitBtn) {
                        submitBtn.click()
                    }
                }}>
                    {t('warranty_comment_type.REPLY_TYPE')}
                </Button>
            ]}
        >
            <Spin spinning={initDetail} indicator={antIcon}>
                <ReplyComment visible={visible}
                              loading={setInitDetail}
                              setVisible={setVisible}
                              rerender={rerender}
                              t={t}
                              detail={detail}
                />
            </Spin>
        </Modal>
    </Fragment>
}