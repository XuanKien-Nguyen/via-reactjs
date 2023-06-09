import React, {Fragment, useEffect, useState} from "react";
import {InputNumber} from "antd";
import {refundWarrantyTicket} from "../../../../../services/warranty-tickets-manager";
import Modal from "antd/es/modal";

export default ({func}) => {

    const [errResp, setErrResp] = useState('')
    const [refundAmount, setRefundAmount] = useState(0)

    const execute = (detail, loading, hiddenModal, rerender) => {
        if (!refundAmount) {
            setErrResp('Vui lòng số tiền muốn hoàn')
            return
        }
        loading(true)
        refundWarrantyTicket(detail.id, refundAmount).then(resp => {
            if (resp.status === 200) {
                Modal.success({
                    content: resp.data.message,
                    onOk: () => {
                        hiddenModal(false)
                        rerender()
                    }
                })
            }
        }).catch(err => setErrResp(err.response.data.message)).finally(() => loading(false))
    }

    useEffect(() => {
        func.execute = execute
    }, [refundAmount])

    return <Fragment>
        <p>Nhập số tiền muốn hoàn cho yêu cầu: </p>
        <InputNumber value={refundAmount} onChange={e => {
            setRefundAmount(e)
            setErrResp('')
        }} style={{width: '100%'}}/>
        <span style={{color: 'red'}}>{errResp}</span>
    </Fragment>
}