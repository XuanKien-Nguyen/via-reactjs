import React, {Fragment, useEffect, useState} from "react";
import {Modal, Input, message, Button} from "antd";
import {isEmail} from "../../../../utils/helpers";
import {forgotPassword} from "../../../../services/user";
import {useTranslation} from "react-i18next";

export default ({visible, setVisible}) => {

    const { t } = useTranslation()

    const [email, setEmail] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const [pending, setPending] = useState(false)

    const handleForgotPassword = () => {
        if (!email) {
            setErrMessage('Vui lòng nhập địa chỉ email');
            return
        } else if(!isEmail(email)) {
            setErrMessage('Địa chỉ email không hợp lệ');
            return
        }
        setPending(true)
        forgotPassword({email}).then(resp => {
            if (resp.status === 200) {
                message.success(resp?.data?.message)
                setVisible(false)
            }
        }).catch(err => setErrMessage(err.response?.data?.message))
            .finally(() => setPending(false))
    }

    useEffect(() => {
        setErrMessage('')
    }, [email, visible])

    return <Fragment>
        <div>
            <Modal
                title="Quên mật khẩu"
                visible={visible}
                onOk={handleForgotPassword}
                onCancel={() => setVisible(false)}
                cancelText={'Huỷ bỏ'}
                footer={[
                    <Button key="back" disabled={pending} onClick={() => setVisible(false)}>
                        {t('common.cancel')}
                    </Button>,
                    <Button key="submit" type="primary" loading={pending} onClick={handleForgotPassword}>
                        OK
                    </Button>
                ]}
            >
                <p>Nhập địa chỉ email: </p>
                <Input value={email} onChange={e => setEmail(e.target.value)} autoFocus={true} onPressEnter={handleForgotPassword} />
                <p style={{color: 'red', marginTop: '10px'}}>{errMessage}</p>
            </Modal>
        </div>
    </Fragment>
}