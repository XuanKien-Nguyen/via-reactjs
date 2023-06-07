import React, {Fragment, useState} from "react";
import {Col, message, Row, Modal} from "antd";
import {getSyntaxToTopupBanking} from "../../../../../../services/recharge";
import { useTranslation } from 'react-i18next';
import Input from "antd/es/input";
const {Search} = Input;

export default ({loading, copy}) => {

    const { t } = useTranslation()

    const [rechargeInfo, setRechargeInfo] = useState(null)


    const handleRecharge = val => {
        loading(true)
        getSyntaxToTopupBanking({amount: val}).then(resp => {
            if (resp.status === 200) {
                setRechargeInfo(resp.data)
            }
        }).catch(err => {
            Modal.error({
                content: err.response?.data?.message || `${t('message.error_get_recharge_code')}: ` + err,
                onOk: () => {}
            });
        })
            .finally(() => loading(false))
    }

    return <Fragment>
        <div>
            <h1>{t('recharge.placeholder')}: </h1>
            <Search
                placeholder={t('recharge.placeholder')}
                enterButton={t('recharge.top_up')}
                type={'number'}
                size="default"
                step={1000}
                onSearch={handleRecharge}
            />
        </div>
        {
            rechargeInfo && <Fragment><h1 className={'m-t-10 m-b-10'}>{t('recharge.auto_top_up')}</h1>
                <p className={'m-t-10 m-b-10'}><i style={{color: 'blue'}}>{t('recharge.content')}</i></p>

                <div style={{display: "flex"}}>
                    <Row>
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <div style={{padding: "10px", borderRight: '1px solid #eaeaea'}}>
                                <div style={{
                                    height: '40px',
                                    backgroundColor: '#EFF8FF',
                                    textAlign: 'center',
                                    padding: '5px',
                                    fontWeight: '900'
                                }}>
                                    <h1 style={{fontWeight: 'bold'}}>{t('recharge.wire_transfer')}</h1></div>
                                <Row className={'recharge-bank-information'}>
                                    <Col span={8}>{t('recharge.bank')}</Col>
                                    <Col span={10}><span style={{color: "red"}}>ACB</span></Col>
                                    <Col className={'recharge-bank-information-copy'} onClick={() => copy('ACB')}
                                         span={6}>{t('common.copy')}</Col>
                                </Row>
                                <Row className={'recharge-bank-information'}>
                                    <Col span={8}>{t('recharge.owner')}</Col>
                                    <Col span={10}><span style={{color: "red"}}>{rechargeInfo.accountNameBanking}</span></Col>
                                    <Col span={6} className={'recharge-bank-information-copy'}
                                         onClick={() => copy(rechargeInfo.accountNameBanking)}>{t('common.copy')}</Col>
                                </Row>
                                <Row className={'recharge-bank-information'}>
                                    <Col span={8}>{t('recharge.account_number')}</Col>
                                    <Col span={10}><span style={{color: "red"}}>{rechargeInfo.accountNumberBanking}</span></Col>
                                    <Col span={6} className={'recharge-bank-information-copy'}
                                         onClick={() => copy(rechargeInfo.accountNumberBanking)}>{t('common.copy')}</Col>
                                </Row>
                                <Row className={'recharge-bank-information'}>
                                    <Col span={8}>{t('recharge.transfer_content')}</Col>
                                    <Col span={10}><span style={{color: "red"}}>{rechargeInfo.systax}</span></Col>
                                    <Col span={6} className={'recharge-bank-information-copy'}
                                         onClick={() => copy(rechargeInfo.systax)}>{t('common.copy')}</Col>
                                </Row>

                            </div>
                        </Col>
                        <Col lg={{span: 12}} sm={{span: 24}}>
                            <div style={{padding: "10px"}}>
                                <div style={{
                                    height: '40px',
                                    backgroundColor: '#EFF8FF',
                                    textAlign: 'center',
                                    padding: '5px',
                                    fontWeight: '900'
                                }}>
                                    <h1 style={{fontWeight: 'bold'}}>{t('recharge.qr_scan')}</h1></div>
                                <div style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    display: 'flex',
                                    paddingBottom: '30px',
                                    borderBottom: '1px solid #eaeaea',
                                    marginTop: '10px'
                                }}>
                                    <div style={{width: "300px"}} dangerouslySetInnerHTML={{__html: rechargeInfo.Qrcode}}/>
                                </div>

                                <div id="payQRTutorial">
                                    <div className={'pay-item'}>
                                        <h1 style={{fontSize: '20px', fontWeight: "bold"}}>{t('recharge.guide_qr')}</h1>
                                    </div>
                                    <div className={'pay-item'}>
                                        <span>{t('recharge.guide_1')}</span>
                                    </div>
                                    <div className={'pay-item'}>
                                        <span>{t('recharge.guide_2')}</span>
                                    </div>
                                    <div className={'pay-item'}>
                                        <span>{t('recharge.guide_3')}</span>
                                    </div>
                                    <div className={'pay-item'}>
                                        <span style={{color: 'red'}}>{t('recharge.caution')}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>
            </Fragment>
        }</Fragment>
}