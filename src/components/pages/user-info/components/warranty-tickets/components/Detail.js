import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "antd/es/modal";
import {PageHeader, Descriptions, Card, Col, Row, Button, Icon, Spin, Tag} from 'antd';
import {getComments} from "../../../../../../services/warranty-tickets";
import {convertCurrencyVN} from "../../../../../../utils/helpers";
import Meta from "antd/es/card/Meta";
import Avatar from "antd/es/avatar";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}

export default ({detail, visible, setVisible, reload, mapStatus}) => {

    const [cmtList, setCmtList] = useState({})
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()

    useEffect(() => {
        setLoading(true)
        const resp = {
            "message": "Tìm kiếm thành công danh sách comment của ticket bảo hành #7",
            "warrantyTicketCommentList": [
                {
                    "id": 14,
                    "user_id": 11507,
                    "warranty_ticket_id": 7,
                    "type": "reply",
                    "comment": "<div class='server-send-first-comment'><p>Yêu cầu bảo hành 1 Via Mẽo Hẹn Hò:</p><ul><li>100056771291791|fv5jsxyjuzv|WHUSG6MDCGVPCBJUDZ2Q2WO7ZYZ4IMOF|rosaswilkust@hotmail.com|rFenkk62|rosaswilkust@getnada.com</li></ul><p>thuộc đơn hàng #9</p><p><br>CKEditor 5 Framework logs errors and warnings to the console. The following list contains more detailed descriptions of those issues.</p><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-alignment-config-classname-already-defined\"><strong>alignment-config-classname-already-defined</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-alignment-config-classnames-are-missing\"><strong>alignment-config-classnames-are-missing</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-alignment-config-name-already-defined\"><strong>alignment-config-name-already-defined</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-alignment-config-name-not-recognized\"><strong>alignment-config-name-not-recognized</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotation-invalid-target\"><strong>annotation-invalid-target</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationcollection-duplicated-item\"><strong>annotationcollection-duplicated-item</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationcollection-not-existing-item\"><strong>annotationcollection-not-existing-item</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-annotation-mismatch\"><strong>annotationsuis-annotation-mismatch</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-missing-ui\"><strong>annotationsuis-missing-ui</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-missing-ui\"><strong>annotationsuis-missing-ui</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-missing-ui\"><strong>annotationsuis-missing-ui</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-register-already-registered\"><strong>annotationsuis-register-already-registered</strong></a></h3><h3><a href=\"https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-annotationsuis-register-invalid-interface\"><strong>annotationsuis-register-invalid-interface</strong></a></h3></div>",
                    "image_url": null,
                    "created_time": "2023-06-05 10:49:34",
                    "createdby": "cykme08",
                    "created_role": "customer"
                }
            ]
        }
        console.log('detail', detail);
        setCmtList(resp.warrantyTicketCommentList)
        setLoading(false)

        // getComments(id).then(resp => {
        //     console.log('resp', resp);
        // }).catch(err => console.log('err', err))
        //     .finally(() => setLoading(false))
    }, [detail])

    return <div>
        <Modal
            className={'modal-body-80vh'}
            width={'80%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('warranty-tickets.detail')}
            onOk={() => {
            }}
            onCancel={() => () => {
                setVisible(false)
            }}
            footer={[
                <Button key="submit" type="danger" disabled={loading} onClick={() => setVisible(false)}>
                    {t('common.close')}
                </Button>,
                // <Button key="submit" type="primary" disabled={loading} onClick={() => {
                //     const submitBtn = document.getElementById('submit-warranty')
                //     if (submitBtn) {
                //         submitBtn.click()
                //     }
                // }}>
                //     {t('common.create')}
                // </Button>
            ]}
        >
            <Spin spinning={loading} indicator={antIcon}>
                {detail && <div
                    style={{
                        backgroundColor: '#F5F5F5',
                        padding: 24,
                    }}
                >
                    <PageHeader
                        ghost={false}
                        title={detail.title}
                        subTitle={`#${detail.id}`}
                        extra={[<Tag color={STATUS_COLOR[detail.status]}>{t(mapStatus[detail.status])}</Tag>]}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label={t('order.purchase-id')}>
                                {`#${detail.purchase_id}`}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('warranty-tickets.category_price')}>
                                {convertCurrencyVN(detail.category_price)}
                            </Descriptions.Item>
                            <Descriptions.Item/>
                            <Descriptions.Item
                                label={t('warranty-tickets.total_product_request')}>{detail.total_product_request}</Descriptions.Item>
                            <Descriptions.Item
                                label={t('warranty-tickets.total_product_reject')}>{detail.total_product_reject}</Descriptions.Item>
                            <Descriptions.Item
                                label={t('warranty-tickets.total_refund_warranty')}>{convertCurrencyVN(detail.total_refund_warranty)}</Descriptions.Item>
                            <Descriptions.Item
                                label={t('warranty-tickets.createdBy')}>{detail.createdby}</Descriptions.Item>
                            <Descriptions.Item
                                label={t('warranty-tickets.created_time')}>{detail.created_time}</Descriptions.Item>
                            <br/>
                            <Descriptions.Item
                                label={t('warranty-tickets.latest_decidedby')}>{detail.latest_decidedby || '-'}</Descriptions.Item>
                            <Descriptions.Item
                                label={t('warranty-tickets.latest_decided_time')}>{detail.latest_decided_time || '-'}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {cmtList.map(el => {
                        return <Card
                            style={{marginTop: 16}}
                            actions={[
                                <Icon type="setting" key="setting"/>,
                                <Icon type="edit" key="edit"/>,
                                <Icon type="ellipsis" key="ellipsis"/>,
                            ]}
                        >
                            <Meta
                                avatar={
                                    <div>
                                        <Avatar src={require('../../../../../../assets/img/avatar.png')}/>
                                    </div>
                                }
                                title="Card title"
                                description={<div dangerouslySetInnerHTML={{__html: el.comment}}/>}
                            />
                        </Card>
                    })}

                </div>}
            </Spin>
        </Modal>
    </div>
}