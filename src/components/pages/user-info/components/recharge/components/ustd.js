import React, {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Modal from "antd/es/modal";
import {Button, message, Row, Col} from "antd";
import Input from "antd/es/input";
import {changeBinanceWallet} from "../../../../../../services/user";
import {getSyntaxToTopupUSDT} from "../../../../../../services/recharge";
import Tag from "antd/es/tag";

export default ({loading, copy, changTab}) => {

    const [pending, setPending] = useState(false)
    const user = useSelector(store => store.user)

    const [visible, setVisible] = useState(false)
    const [binanceWallet, setBinanceWallet] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [ustdAddress, setUstdAddress] = useState('')


    useEffect(() => {
        setVisible(!isHaveWalletAddress())
    }, [user])

    useEffect(() => {
        loading(true)
        getSyntaxToTopupUSDT().then(resp => {
            if (resp.status === 200) {
                setUstdAddress(resp?.data?.binanceUsdtTrc20Address)
            }
        }).finally(() => loading(false))
    }, [])

    const isHaveWalletAddress = () => {
        return user?.usdttrc20_wallet_address && user.usdttrc20_wallet_address.length > 0
    }

    const handleUpdateBinanceWallet = () => {
        if (!binanceWallet) {
            setErrorMessage('Vui lòng nhập địa chỉ ví')
            return
        }
        setPending(true)
        changeBinanceWallet({usdt_trc20_address: binanceWallet}).then(resp => {
            if (resp?.status === 200) {
                message.success(resp?.data?.message)
                setVisible(false)
                setBinanceWallet('')
            }
        }).catch(err => setErrorMessage(err.response?.data?.message))
            .finally(() => setPending(false))
    }

    return <Fragment>
        <Modal
            onCancel={() => {
                if (!isHaveWalletAddress()) {
                    changTab('bank')
                } else {
                    setVisible(false)
                }
            }}
            maskClosable={false}
            title="Cập nhật địa chỉ ví"
            visible={visible}
            footer={[
                <Fragment>
                    {isHaveWalletAddress() &&
                    <Button loading={pending} type={'danger'} onClick={() => setVisible(false)}>
                        Hủy bỏ
                    </Button>}
                    <Button loading={pending} type={'primary'} onClick={handleUpdateBinanceWallet}>
                        OK
                    </Button>
                </Fragment>
            ]}
        >
            {!isHaveWalletAddress() &&
            <b style={{color: 'blue'}}>Bạn chưa có địa chỉ ví, vui lòng cập nhật địa chỉ ví</b>}
            <p className={`m-t-10`}>Nhập địa chỉ ví: </p>
            <Input placeholder={'Nhập địa chỉ ví'} value={binanceWallet}
                   onChange={e => setBinanceWallet(e.target.value)}/>
            <b style={{color: 'red'}}>{errorMessage}</b>
        </Modal>
        <p>Địa chỉ ví hiện tại của bạn: <Tag color="#2db7f5"
                                             style={{color: 'white'}}>{user?.usdttrc20_wallet_address}</Tag> <a
            onClick={() => setVisible(true)}>bấm vào đây</a> để cập nhật địa chỉ</p>
        Vui lòng chuyển tiền đến địa chỉ ví bên dưới:
        <Row>
            <Col className={'ustd-address'}>{ustdAddress}</Col>
            <p className={'m-t-10'} style={{textAlign: 'center'}}>
                <Button onClick={() => copy(ustdAddress)} type='danger'>Sao chép</Button>
            </p>
        </Row>
    </Fragment>
}