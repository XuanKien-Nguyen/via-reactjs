import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "antd/es/modal";
import {PageHeader, Card, Col, Row, Button, Icon, Spin, Tag, Tooltip, Carousel} from 'antd';
import {getComments, getListTypeComment} from "../../../../../../services/warranty-tickets";
import {convertCurrencyVN} from "../../../../../../utils/helpers";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}

const TYPE_COLOR = {
    replace: 'grey',
    refund: '#99cc33',
    reject: 'red',
    retake: '#c7dcdd',
    reply: '#ffcc00',
    finish: 'blue'
}

const MAP_TYPE = {}

export default ({detail, setDetail, visible, setVisible, reload, mapStatus}) => {

    const [cmtList, setCmtList] = useState([])
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()

    useEffect(() => {
        setLoading(true)
        getListTypeComment().then(resp => {
            if (resp.status === 200) {
                const data = resp.data
                for (const key of Object.keys(data)) {
                    MAP_TYPE[data[key]] = `warranty_comment.${key}`
                }
            }
        }).catch(err => console.log(err?.response?.data?.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (detail) {
            setLoading(true)
            getComments(detail.id).then(resp => {
                if(resp.status === 200) {
                    setCmtList(resp.data.warrantyTicketCommentList)
                }
            }).catch(err => console.log('err', err))
                .finally(() => setLoading(false))
        } else {
            setCmtList([])
        }
    }, [detail])

    const viewListImage = (row) => {
        if (row && row.image_url) {
            Modal.info({
                icon: null,
                okText: t('common.close'),
                content: <section id="slider-layout">
                    <Carousel arrows autoplay={true}> {
                        row.image_url.map(el =>
                            <div className='slide-item'>
                                <div className='slide-item-container'>
                                    <img width={'100%'} alt='slide-item' src={el}/>
                                </div>
                            </div>)}
                    </Carousel>
                </section>
            })
        }
    }

    return <div>
        <Modal
            className={'modal-body-80vh'}
            width={'90%'}
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
                <Button key="submit" type="danger" disabled={loading} onClick={() => {
                    setCmtList([])
                    setDetail(null)
                    setVisible(false)
                }}>
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
                        padding: 5,
                    }}
                >
                    <PageHeader
                        ghost={false}
                        title={detail.title}
                        subTitle={`#${detail.id}`}
                        extra={[<Tag color={STATUS_COLOR[detail.status]}>{t(mapStatus[detail.status])}</Tag>]}
                    >
                        <Row>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('order.purchase-id')}</span>: {` #${detail.purchase_id}`}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.category_price')}</span>: {` ` + convertCurrencyVN(detail.category_price)}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.total_refund_warranty')}</span>: {convertCurrencyVN(detail.total_refund_warranty)}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.total_product_request')}</span>: {detail.total_product_request}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.total_product_reject')}</span>: {detail.total_product_reject}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.total_product_replace')}</span>: {detail.total_product_replace}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.createdBy')}</span>: {detail.createdby}
                            </Col>
                            <Col sm={24} lg={16} className={'m-b-10'}>
                                <span>{t('warranty-tickets.created_time')}</span>: {detail.created_time}
                            </Col>
                            <Col sm={24} lg={8} className={'m-b-10'}>
                                <span>{t('warranty-tickets.latest_decidedby')}</span>: {detail.latest_decidedby || '-'}
                            </Col>
                            <Col sm={24} lg={16} className={'m-b-10'}>
                                <span>{t('warranty-tickets.latest_decided_time')}</span>: {detail.latest_decided_time || '-'}
                            </Col>
                        </Row>
                    </PageHeader>
                    {cmtList.map(el => {
                        return <Card
                            bordered
                            style={{marginTop: 16}}
                            actions={[
                                <Tooltip title={t('recharge-tickets.image')}>
                                    <div onClick={() => viewListImage(el)}>
                                        <Icon type="file-image" key="setting"/> ({el.image_url?.length || 0})
                                    </div>
                                </Tooltip>,
                                <Tooltip title={t('warranty-tickets.created_time')}>
                                    <span className={'m-t-10'}>{el.created_time}</span>
                                </Tooltip>
                            ]}
                        >
                            <Row gutter={30}>
                                <Col sm={24} lg={4} style={{
                                    textAlign: 'center',
                                    border: '1px solid #eaeaea',
                                    padding: '35px',
                                    marginBottom: '10px'
                                }}>
                                    <img src={require('../../../../../../assets/img/avatar.png')} alt=""
                                         className="src"/>
                                    <p style={{textAlign: 'center', fontSize: '12px'}}>{`@${el.createdby}`}<i
                                        className="id_text">{` #${el.user_id}`}</i></p>
                                    <Tag
                                        color={el.created_role === 'admin' ? 'red' : 'blue'}>{el.created_role}</Tag>
                                    <Tag style={{
                                        position: 'absolute',
                                        top: '0px',
                                        right: '-8px',
                                        borderBottomRightRadius: '0px',
                                        borderTopRightRadius: '0px',
                                        borderTopLeftRadius: '0px'
                                    }}
                                         color={TYPE_COLOR[el.type]}><b>{el.type}</b></Tag>
                                    <br/>
                                </Col>

                                <Col sm={24} lg={20} style={{overflow: 'auto'}}>
                                    <p style={{marginBottom: '0px', textAlign: 'right'}}>#{el.id}</p>
                                    <div dangerouslySetInnerHTML={{__html: el.comment}}/>
                                </Col>
                            </Row>
                        </Card>
                    })}
                    {viewListImage()}
                </div>}
            </Spin>
        </Modal>
    </div>
}