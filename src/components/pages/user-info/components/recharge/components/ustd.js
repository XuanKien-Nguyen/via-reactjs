import React, {Fragment, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Modal from "antd/es/modal";
import {Button, message, Row, Col} from "antd";
import Input from "antd/es/input";
import {changeBinanceWallet} from "../../../../../../services/user";
import {getSyntaxToTopupUSDT} from "../../../../../../services/recharge";
import Tag from "antd/es/tag";
import { useTranslation } from 'react-i18next';

export default ({loading, copy, changTab}) => {

    const { t } = useTranslation()

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
            setErrorMessage(t('recharge.wallet_error'))
            return
        }
        setPending(true)
        changeBinanceWallet({usdt_trc20_address: binanceWallet}).then(resp => {
            if (resp?.status === 200) {
                Modal.success({
                    content: resp?.data?.message,
                    onOk: () => {}
                });
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
            title={t('recharge.wallet_title')}
            visible={visible}
            footer={[
                <Fragment>
                    {isHaveWalletAddress() &&
                    <Button loading={pending} type={'danger'} onClick={() => setVisible(false)}>
                        {t('common.cancel')}
                    </Button>}
                    <Button loading={pending} type={'primary'} onClick={handleUpdateBinanceWallet}>
                        {t('common.ok')}
                    </Button>
                </Fragment>
            ]}
        >
            {!isHaveWalletAddress() &&
            <b style={{color: 'blue'}}>{t('recharge.wallet_empty')}</b>}
            <p className={`m-t-10`}>{t('recharge.wallet_placeholder')}: </p>
            <Input placeholder={t('recharge.wallet_placeholder')} value={binanceWallet}
                   onChange={e => setBinanceWallet(e.target.value)}/>
            <b style={{color: 'red'}}>{errorMessage}</b>
        </Modal>
        <p>{t('recharge.wallet_current')}: <Tag color="#2db7f5"
                                             style={{color: 'white'}}>{user?.usdttrc20_wallet_address}</Tag> <a
            onClick={() => setVisible(true)}>{t('recharge.wallet_click')}</a> {t('recharge.wallet_text')}</p>
        {t('recharge.wallet_content')}:
        <Row>
            <Col className={'ustd-address'}>{ustdAddress}</Col>
            <p className={'m-t-10'} style={{textAlign: 'center'}}>
                <Button onClick={() => copy(ustdAddress)} type='danger'>{t('common.copy')}</Button>
            </p>
        </Row>
    </Fragment>
}