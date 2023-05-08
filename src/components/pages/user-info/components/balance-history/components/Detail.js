import React, {Fragment} from "react";
import {Button, Modal, Row, Col} from "antd";
import {convertCurrencyVN} from "../../../../../../utils/helpers";

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
        }
        return <b style={{color: 'green'}}>{el === 0 ? '0' : `${prefix}${convertCurrencyVN(el)}`}</b>
    }

    return  <div>
        {detail && <Modal
            visible={visible}
            width={800}
            title={`Chi tiết lịch sử thay đổi số dư #${detail?.id}`}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="submit" type="primary" onClick={() => setVisible(false)}>
                    Đóng
                </Button>,
            ]}
        >
            <div id={'balance_detail'}>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Loại</b></Col>
                    <Col sm={16}>{t(mapType[detail.type])}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Tên sản phẩm</b></Col>
                    <Col sm={16}>{getValue(detail.category_name)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Mã đơn hàng</b></Col>
                    <Col sm={16}>{detail.purchase_id ? <a onClick={() => window.location.href = `/user-info?menu=purchase&id=${detail.purchase_id}`
                    }>#{detail.purchase_id}</a> : '-'}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Mã nạp tiền</b></Col>
                    <Col sm={16}>{getValue(detail.transaction_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Mã ticket nạp lỗi</b></Col>
                    <Col sm={16}>{getValue(detail.recharge_ticket_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Mã ticket bảo hành</b></Col>
                    <Col sm={16}>{getValue(detail.warranty_ticket_id)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Tiền khuyến mãi</b></Col>
                    <Col sm={16}>{renderMoney(detail.add_bonus)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Tiền tài khoản</b></Col>
                    <Col sm={16}>{renderMoney(detail.add_amount)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Số dư khuyến mãi</b></Col>
                    <Col sm={16}>{renderMoney(detail.bonus_remain, '')}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Số dư tài khoản</b></Col>
                    <Col sm={16}>{renderMoney(detail.amount_remain, '')}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Nội dung</b></Col>
                    <Col sm={16}>{getValue(detail.content)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Ghi chú</b></Col>
                    <Col sm={16}>{getValue(detail.comment)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Tạo bởi</b></Col>
                    <Col sm={16}>{getValue(detail.createdby)}</Col>
                </Row>
                <Row className={'history_detail'}>
                    <Col sm={8}><b>Thời gian</b></Col>
                    <Col sm={16}>{getValue(detail.created_time)}</Col>
                </Row>
            </div>
        </Modal>}
    </div>
}