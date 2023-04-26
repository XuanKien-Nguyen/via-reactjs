import React, {Fragment, useEffect, useState} from "react";
import {getQrImage, verify2fa} from "../../../../services/user";
import {Button, message} from "antd";
import Modal from "antd/es/modal";
import Input from "antd/es/input";
import {useSelector, useDispatch} from "react-redux";
import Alert from "antd/es/alert";

const Enable2Fa = ({loading}) => {

    const [imgSrc, setImgSrc] = useState()
    const [visible, setVisible] = useState(false)
    const [errorText, setErrorText] = useState('')

    const [verifying, setVerifying] = useState(false)

    const [otp, setOtp] = useState('')

    const dispatch = useDispatch();

    const user = useSelector(store => store.user)

    useEffect(() => {
        if (!user?.is_enable_2fa) {
            _getQrImage()
        }
    }, [])

    const _getQrImage = () => {
        loading(true)
        getQrImage().then(resp => {
            if (resp.status === 200) {
                message.success('Lấy mã QR thành công')
                setImgSrc(resp?.data?.QRCodeImage || '')
            }
        }).catch(err => {
            message.error('Có lỗi xảy ra khi lấy mã QR')
        }).finally(() => loading(false))
    }

    useEffect(() => {
        setOtp('')
        setErrorText('')
    }, [visible])

    const handleVerify2Fa = () => {
        if (otp) {
            setVerifying(true)
            verify2fa({otpToken: otp}).then(resp => {
                const payload = {...user, is_enable_2fa: true}
                dispatch({type: 'SET_USER_INFO', payload})
                message.success(resp?.data?.message || 'Bật xác thực 2Fa thành công')
                setVisible(false)
                // }
            }).catch(err => {
                const response = err.response
                setErrorText(response?.data?.message || ' Có lỗi xảy ra khi xác thực 2fa: ' + err)
            }).finally(() => setVerifying(false))
        } else {
            setErrorText('Vui lòng nhập mã OTP')
        }
    }

    const onChangeOtp = (e) => {
        setOtp(e.target.value)
        if (!e.target.value) {
            setErrorText('Vui lòng nhập mã OTP')
        } else {
            setErrorText('')
        }
    }

    return <Fragment>
        <div align={'center'}>
            <div dangerouslySetInnerHTML={{__html: imgSrc}}/>
            {(imgSrc && user?.is_enable_2fa === false) && <Fragment>
                    <div>
                        <Button onClick={_getQrImage}>{imgSrc ? 'Refresh' : 'Get QR'}</Button>
                    </div>
                    <Button style={{marginTop: '10px'}} type={'primary'} onClick={() => setVisible(true)}>
                        Bật xác thực 2FA
                    </Button>
                </Fragment>}
            {user?.is_enable_2fa &&
            <Alert message="Tài khoản này đã được bật xác thực 2fa" type="success" style={{marginTop: '20px'}}/>}
            <Modal
                closable={false}
                visible={visible}
                maskClosable={false}
                title="Xác thực 2FA"
                onOk={handleVerify2Fa}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="back" disabled={verifying} onClick={() => setVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={verifying} onClick={handleVerify2Fa}>
                        Bật xác thực 2fa
                    </Button>
                ]}
            >
                <Input addonBefore="Mã OTP" value={otp} onChange={onChangeOtp}/>
                <p style={{margin: '5px', color: 'red'}}>{errorText}</p>
            </Modal>
        </div>

    </Fragment>
}


export default Enable2Fa
