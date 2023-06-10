import Modal from "antd/es/modal";
import {Button, Input} from "antd";
import React, {useState} from "react";
import {markErrorProductToReplace} from "../../../../../../services/warranty-tickets-manager";

export default ({detail, visible, setVisible}) => {

    const [productErrorDetail, setProductErrorDetail] = useState('')
    const [errorDetail, setErrorDetail] = useState('')
    const [err, setErr] = useState('')
    const [err1, setErr1] = useState('')
    const [pending, setPending] = useState(false)

    const handleSubmit = () => {
        if (!productErrorDetail) {
            setErr('Vui lòng nhập sản phẩm bị lỗi')
        }
        if (!errorDetail) {
            setErr1('Vui lòng nhập mô tả lỗi')
        }
        if (productErrorDetail && errorDetail) {
            Modal.confirm({
                content: 'Bạn có chắc chắn muốn báo lỗi những sản phẩm này?',
                cancelText: 'Huỷ bỏ',
                onOk: () => {
                    setPending(true)
                    const form = new FormData()
                    markErrorProductToReplace(detail.id, {productErrorDetail, errorDetail}).then(resp => {
                        if (resp.status === 200) {
                            console.log(resp);
                            Modal.success({
                                content: resp.data.message,
                                onOk: () => {
                                    // console.log(e);
                                    // fetchProductRequest()
                                }
                            })
                        }
                    }).catch(err => Modal.error({
                        content: err.response.data.message
                    })).finally(() => setPending(false))
                }
            })
        }
    }

    return <div>
        <Modal
            closable={false}
            title="Báo lỗi sản phẩm"
            visible={visible}
            className={'modal-body-80vh'}
            centered
            width={'700px'}
            footer={[
                <Button key="submit" type="danger" disabled={pending} onClick={() => setVisible(false)}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" loading={pending} onClick={handleSubmit}>
                    Báo lỗi
                </Button>,
            ]}
        >
            <p><span style={{color: 'red'}}>*</span>Sản phẩm lỗi</p>
            <Input.TextArea rows={10} onChange={e => {
                setProductErrorDetail(e.target.value)
                setErr('')
            }}/>
            <span style={{color: 'red'}}>{err}</span>
            <p><span style={{color: 'red'}}>*</span>Mô tả lỗi</p>
            <Input.TextArea rows={10} onChange={e => {
                setErrorDetail(e.target.value)
                setErr1('')
            }}/>
            <span style={{color: 'red'}}>{err1}</span>
        </Modal>
    </div>
}