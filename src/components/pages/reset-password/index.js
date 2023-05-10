import React, {useContext, useEffect, useState} from "react";
import {Row, Col, Input, Icon, Button, message, Modal} from 'antd'
import {isEmail} from "../../../utils/helpers";
import {resetPassword} from "../../../services/user";
import {LayoutContext} from "../../../contexts";
import {useHistory} from "react-router-dom";

export default () => {

    const history = useHistory()

    const {setLoading} = useContext(LayoutContext)

    const [pass, setPass] = useState('')
    const [rpass, setRpass] = useState('')
    const [err, setErr] = useState('')

    const [email, setEmail] = useState('')
    const [resetPasswordToken, setResetPasswordToken] = useState('')

    const query = new URLSearchParams(window.location.search);

    useEffect(() => {
        const email = query.get('email')
        const resetPasswordToken = query.get('resetPasswordToken')
        if (!email || !isEmail(email) || !resetPasswordToken) {
            window.location.href = '/404'
            return
        }
        setLoading(true)
        setEmail(email)
        setResetPasswordToken(resetPasswordToken)
    }, [])

    const handleBlurCheck = () => {
        if ((pass || rpass) && pass !== rpass) {
            setErr('2 Mật khẩu không khớp')
        } else {
            setErr('')
        }
    }

    const handleResetPassword = () => {
        if (!err) {
            if (!pass) {
                setErr('Vui lòng nhập mật khẩu mới')
                return
            }
            const body = {password: pass}
            resetPassword(email, resetPasswordToken, body).then(resp => {
                if (resp.status === 200) {
                    message.success(resp?.data?.message)
                    // Modal.success({
                    //     content: 'some messages...some messages...',
                    // });
                    history.push('/login')
                }
            }).catch(err => message.error(err.response?.data?.message))
                .finally(() => setLoading(false))
        }
    }

    return <div className={'layout-lg'} style={{padding: '50px'}}>
        <div>
            <h1 align={'center'}><b>THIẾT LẬP LẠI MẬT KHẨU</b></h1>
        </div>
        <Row>
            <p style={{margin: '15px 0px'}}>Địa chỉ email</p>
            <Input value={email} disabled={true} />
            <p style={{margin: '15px 0px'}}>Nhập mật khẩu mới</p>
            <Input.Password onBlur={handleBlurCheck}
                            onChange={e => setPass(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
            <p style={{margin: '15px 0px'}}>Nhập lại mật khẩu mới</p>
            <Input.Password onBlur={handleBlurCheck}
                            onChange={e => setRpass(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
            <p style={{color: 'red'}}>{err}</p>
            <p style={{margin: '15px 0px', textAlign: 'center'}}>
                <Button type={'primary'} onClick={handleResetPassword}>Lưu</Button>
            </p>
        </Row>
    </div>
}