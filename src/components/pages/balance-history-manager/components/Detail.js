import React, {Fragment} from "react";
import {Button, Modal, Row, Col} from "antd";
import {convertCurrencyVN} from "../../../../utils/helpers";

export default ({detail, visible, setVisible, t, mapType}) => {
    const getValue = v => {
        if (v) {
            return v
        }
        return '-'
    }

    const renderMoney = (el, prefix = '+') => {
        if (el && (el + '').startsWith('-')) {
            return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
        }  else if (el === 0) {
            return <b>0 VND</b>
        }
        return <b style={{color: 'green'}}>{`${prefix}${convertCurrencyVN(el)}`}</b>
    }

    return  <div>
        {detail && <Modal
            className={'modal-body-80vh'}
            visible={visible}
            centered
            width={800}
            title={`${t('balance-history.modal-title')} #${detail?.id}`}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>,
            ]}
        >
            <div id={'balance_detail'}>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{'ID người dùng'}</b></Col>
                    <Col sm={16}>{detail.user_id}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{'Tên người dùng'}</b></Col>
                    <Col sm={16}>{detail.username}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.type')}</b></Col>
                    <Col sm={16}>{t(mapType[detail.type])}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.category-name')}</b></Col>
                    <Col sm={16}>{getValue(detail.category_name)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.purchase-id')}</b></Col>
                    <Col sm={16}>{detail.purchase_id ? '#' + detail.purchase_id: '-'}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.transaction-id')}</b></Col>
                    <Col sm={16}>{getValue(detail.transaction_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.recharge-ticket-id')}</b></Col>
                    <Col sm={16}>{getValue(detail.recharge_ticket_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.warranty-ticket-id')}</b></Col>
                    <Col sm={16}>{getValue(detail.warranty_ticket_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.add-bonus')}</b></Col>
                    <Col sm={16}>{renderMoney(detail.add_bonus)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.add-amount')}</b></Col>
                    <Col sm={16}>{renderMoney(detail.add_amount)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.bonus-remain')}</b></Col>
                    <Col sm={16}>{renderMoney(detail.bonus_remain, '')}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.amount-remain')}</b></Col>
                    <Col sm={16}>{renderMoney(detail.amount_remain, '')}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.content')}</b></Col>
                    <Col sm={16}>{getValue(detail.content)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.note')}</b></Col>
                    <Col sm={16}>{getValue(detail.comment)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.created-by')}</b></Col>
                    <Col sm={16}>{getValue(detail.createdby)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>{t('balance-history.created-time')}</b></Col>
                    <Col sm={16}>{getValue(detail.created_time)}</Col>
                </Row>
            </div>
        </Modal>}
    </div>
}