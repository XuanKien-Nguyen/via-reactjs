import React, {useContext, useState} from "react";
import {Button, Input, message} from "antd";
import {LayoutContext} from "../../../contexts";
import {totp} from "otplib";

const {TextArea} = Input
export default () => {

    const {setLoading} = useContext(LayoutContext)
    const [msg, setMsg] = useState('')
    const [secret, setSecret] = useState('')
    const [result, setResult] = useState('')

    const handleCheck = async () => {
        if (!secret) {
            setMsg('Vui lòng nhập 2FA Secret')
            return
        }
        const key = totp.generate(secret)
        setResult(key)
    }

    const copy = () => {
        message.success('Sao chép thành công')
        navigator.clipboard.writeText(result);
    }

    return <div>
        <span className={'m-b-10'}><span style={{color: 'red'}}>*</span><b>
            2FA Secret
        </b><i>-Get code for 2 factor authentication easiest - Please store your 2FA secret safely</i></span>
        <TextArea rows={10}
                  placeholder={"HDGC HSY3 IVYS..."}
                  value={secret}
                  onChange={e => {
            setSecret(e.target.value)
            setMsg('')
        }}/>
        <p className={'m-t-10'} style={{color: 'red'}}>{msg}</p>
        <p className={'m-t-10'} style={{textAlign: "center"}}>
            <Button type={'primary'}
                    onClick={handleCheck}>
                Submit
            </Button>
        </p>
        <span className={'m-b-10'}><b>
            2FA Code
        </b><i>2-step verification code</i></span>
        <TextArea rows={10} value={result} disabled={true} placeholder={"2FA Code"}/>
        <Button className={'m-t-10'} disabled={!result} onClick={copy}>Copy</Button>
    </div>
}