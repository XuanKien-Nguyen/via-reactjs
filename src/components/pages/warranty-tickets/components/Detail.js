import React, {Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "antd/es/modal";
import {Button, Card, Carousel, Col, Icon, PageHeader, Row, Select, Spin, Tag, Tooltip} from 'antd'
import ReplyComment from "./create-comment";
import Refund from './refund'
import Replace from './replace'
import Reject from './reject'
import {getListTypeComment} from "../../../../services/warranty-tickets";
import {closeWarrantyTicket, getComments} from "../../../../services/warranty-tickets-manager";
import {convertCurrencyVN} from "../../../../utils/helpers";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

const STATUS_COLOR = {
    pending: 'grey',
    done: '#99cc33',
    rejected: 'red',
    deleted: '#c7dcdd',
    solving: '#ffcc00'
}

const TYPE_COLOR = {
    replace: '#02cd83',
    refund: '#99cc33',
    reject: 'red',
    retake: '#c7dcdd',
    reply: '#ffcc00',
    finish: 'grey'
}

const MAP_TYPE = {}

const {Option} = Select

let CURRENT_FUNC = ''
let FUNC = {}

export default ({detail, setDetail, visible, setVisible, mapStatus, reloadList}) => {

    const [cmtList, setCmtList] = useState([])
    const [loading, setLoading] = useState(false)
    const [visibleCreateComment, setVisibleCreateComment] = useState(false)
    const [filterType, setFilterType] = useState('')
    const {t} = useTranslation()
    const [reload, setReload] = useState(0)

    const [pending, setPending] = useState(false)
    const [visibleFunc, setVisibleFunc] = useState(false)

    useEffect(() => {
        setLoading(true)
        getListTypeComment().then(resp => {
            if (resp.status === 200) {
                const data = resp.data.TYPE_OBJ
                for (const key of Object.keys(data)) {
                    MAP_TYPE[data[key]] = `warranty_comment_type.${key}`
                }
            }
        }).catch(err => console.log(err?.response?.data?.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchComment()
    }, [detail, reload])

    const fetchComment = (type) => {
        if (detail) {
            setLoading(true)
            getComments(detail.id, type).then(resp => {
                if (resp.status === 200) {
                    setCmtList(resp.data.warrantyTicketCommentList)
                }
            }).catch(err => console.log('err', err))
                .finally(() => setLoading(false))
        } else {
            setCmtList([])
        }
    }

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

    const execute = () => {
        if (FUNC) {
            FUNC.execute(detail, setPending, setVisibleFunc, rerender)
        }
    }

    useEffect(() => {
        fetchComment(filterType)
    }, [filterType])

    const rerender = () => setReload(reload + 1)

    const openFunc = (func) => {
        CURRENT_FUNC = func
        setVisibleFunc(true)
    }

    const getTitleFunc = () => {
        if (CURRENT_FUNC === 'REFUND_TYPE') {
            return 'Hoàn tiền cho yêu cầu '
        } else if (CURRENT_FUNC === 'REJECT_TYPE') {
            return 'Từ chối yêu cầu '
        } else if (CURRENT_FUNC === 'REPLACE_TYPE') {
            return 'Đổi trả sản phẩm '
        }
    }

    const closeRequest = () => {
        Modal.confirm({
            cancelText: 'Huỷ bỏ',
            content: <b>Bạn có chắc chắn muốn đóng yêu cầu #{detail.id} không?</b>,
            onOk: () => {
                setLoading(true)
                closeWarrantyTicket(detail.id).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp.data.message,
                            onOk: () => {
                                setCmtList([])
                                setDetail(null)
                                setVisible(false)
                                reloadList()
                            }
                        })
                    }
                }).catch(err => Modal.error({
                    content: err.response.data.message
                }))
                    .finally(() => setLoading(false))
            }
        })
    }

    useEffect(() => {
        setTimeout(() => {
            if (!visibleFunc) {
                CURRENT_FUNC = ''
                FUNC = {}
            }
        }, 200)
    }, [visibleFunc])

    return <div>
        <Modal
            className={'modal-body-80vh'}
            width={'90%'}
            style={{maxWidth: '1140px'}}
            centered
            closable={false}
            visible={visible}
            maskClosable={false}
            title={t('warranty_tickets.detail')}
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
                </Button>
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
                        style={{border: '1px solid #e8e8e8'}}
                        ghost={false}
                        title={detail.title}
                        subTitle={<i>#{detail.id}</i>}
                        extra={[<Tag color={STATUS_COLOR[detail.status]}>{t(mapStatus[detail.status])}</Tag>]}
                    >
                        {/* <Row>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('order.purchase_id')}</span>: <b><i>{` #${detail.purchase_id}`}</i></b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.category_price')}</span>: <b>{` ` + convertCurrencyVN(detail.category_price)}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.createdBy')}</span>: <b>{detail.createdby}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.latest_decidedby')}</span>: <b>{detail.latest_decidedby || '-'}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.total_product_request')}</span>: <b>{detail.total_product_request}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.total_product_reject')}</span>: <b>{detail.total_product_reject}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.total_product_replace')}</span>: <b>{detail.total_product_replace}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.total_refund_warranty')}</span>: <b>{convertCurrencyVN(detail.total_refund_warranty)}</b>
                            </Col>
                            <Col sm={24} lg={6} className={'m-b-10'}>
                                <span>{t('warranty_tickets.created_time')}</span>: <b>{detail.created_time}</b>
                            </Col>
                            <Col sm={24} lg={10} className={'m-b-10'}>
                                <span>{t('warranty_tickets.latest_decided_time')}</span>: <b>{detail.latest_decided_time || '-'}</b>
                            </Col>
                        </Row> */}
                        <div style={{display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(4, 1fr)', gap: '8px 8px'}}>
                            <div><span>{t('order.purchase_id')}</span>: <b><i>{` #${detail.purchase_id}`}</i></b></div>
                            <div><span>{t('warranty_tickets.category_price')}</span>: <b>{` ` + convertCurrencyVN(detail.category_price)}</b></div>
                            <div><span>{t('warranty_tickets.createdBy')}</span>: <b>{detail.createdby}</b></div>
                            <div><span>{t('warranty_tickets.latest_decidedby')}</span>: <b>{detail.latest_decidedby || '-'}</b></div>
                            <div><span>{t('warranty_tickets.total_product_request')}</span>: <b>{detail.total_product_request}</b></div>
                            <div><span>{t('warranty_tickets.total_product_reject')}</span>: <b>{detail.total_product_reject}</b></div>
                            <div><span>{t('warranty_tickets.total_product_replace')}</span>: <b>{detail.total_product_replace}</b></div>
                            <div><span>{t('warranty_tickets.total_refund_warranty')}</span>: <b>{convertCurrencyVN(detail.total_refund_warranty)}</b></div>
                            <div><span>{t('warranty_tickets.created_time')}</span>: <b>{detail.created_time}</b></div>
                            <div><span>{t('warranty_tickets.latest_decided_time')}</span>: <b>{detail.latest_decided_time || '-'}</b></div>
                        </div>
                    </PageHeader>
                    <p style={{
                        marginTop: '10px',
                        height: '27px',
                        textAlign: 'left',
                        position: 'relative'
                    }}>
                        <Select defaultValue={filterType} value={filterType}
                                style={{position: 'absolute', right: '5px', width: '120px'}}
                                onChange={v => setFilterType(v)}>
                            {[<Option
                                value={''}>{t('filter.all')}
                            </Option>,
                                Object.keys(MAP_TYPE).map(k => <Option
                                    value={k}>{t(MAP_TYPE[k])}</Option>)]}
                        </Select>
                        {!['closed', 'rejected', 'deleted'].includes(detail.status)
                        && <Fragment>
                            <Button
                                onClick={() => openFunc('REFUND_TYPE')}
                                style={{
                                    marginRight: '5px',
                                    color: 'white',
                                    backgroundColor: TYPE_COLOR['refund']
                                }}>{t('warranty_comment_type.REFUND_TYPE')}</Button>
                            <Button
                                onClick={() => openFunc('REPLACE_TYPE')}
                                style={{
                                    marginRight: '5px',
                                    color: 'white',
                                    backgroundColor: TYPE_COLOR['replace']
                                }}>{t('warranty_comment_type.REPLACE_TYPE')}</Button>
                            <Button
                                onClick={() => openFunc('REJECT_TYPE')}
                                style={{
                                    marginRight: '5px',
                                    color: 'white',
                                    backgroundColor: TYPE_COLOR['reject']
                                }}>{t('warranty_comment_type.REJECT_TYPE')}</Button>
                            <Button
                                onClick={closeRequest}
                                style={{
                                    marginRight: '5px',
                                    color: 'white',
                                    backgroundColor: TYPE_COLOR['finish']
                                }}>{t('warranty_comment_type.FINISH_TYPE')}</Button>
                            <Button type={'primary'}
                                    disabled={detail.status === 'closed'}
                                    onClick={() => setVisibleCreateComment(true)}>{t('warranty_comment_type.REPLY_TYPE')}</Button>
                        </Fragment>}
                    </p>
                    {cmtList.length > 0 ? cmtList.map(el => {
                        return <Card
                            bordered
                            style={{marginTop: 16}}
                            actions={[
                                <div onClick={() => viewListImage(el)}>
                                    Hình ảnh ({el.image_url?.length || 0})
                                </div>,
                                <Tooltip title={'Thời gian tạo'}>
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
                                    <img src={require('../../../../assets/img/avatar.png')} alt=""
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
                                         color={TYPE_COLOR[el.type]}><b>{t(MAP_TYPE[el.type])}</b></Tag>
                                    <br/>
                                </Col>

                                <Col sm={24} lg={20} style={{overflow: 'auto'}}>
                                    <p style={{marginBottom: '0px', textAlign: 'right'}}><i>#{el.id}</i></p>
                                    <div dangerouslySetInnerHTML={{__html: el.comment}}/>
                                </Col>
                            </Row>
                        </Card>
                    }) : <p style={{textAlign: 'center'}}>{t('common.no_data')}</p>}
                    {viewListImage()}
                    <ReplyComment visible={visibleCreateComment}
                                  setVisible={setVisibleCreateComment}
                                  rerender={rerender}
                                  t={t}
                                  detail={detail}/>
                    <Modal
                        // style={{maxWidth: '1140px'}}
                        className={'modal-body-80vh'}
                        width={'90%'}
                        style={{maxWidth: '1140px'}}
                        centered
                        closable={false}
                        visible={visibleFunc}
                        maskClosable={false}
                        title={`${getTitleFunc()} #${detail.id}`}
                        onOk={() => {
                        }}
                        onCancel={() => () => {
                            setVisible(false)
                        }}
                        footer={[
                            <Button key="submit" type="danger" disabled={pending}
                                    onClick={() => setVisibleFunc(false)}>
                                {t('common.close')}
                            </Button>,
                            <Button key="submit" type="primary" disabled={pending} onClick={execute}>
                                {t(`warranty_comment_type.${CURRENT_FUNC}`)}
                            </Button>
                        ]}
                    >
                        {visibleFunc && <Spin spinning={pending} indicator={antIcon}>
                            {CURRENT_FUNC === 'REFUND_TYPE' && <Refund func={FUNC}/>}
                            {CURRENT_FUNC === 'REJECT_TYPE' && <Reject func={FUNC} detail={detail}/>}
                            {CURRENT_FUNC === 'REPLACE_TYPE' &&
                            <Replace func={FUNC} detail={detail} loading={setPending}/>}
                        </Spin>}
                    </Modal>
                </div>}
            </Spin>
        </Modal>
    </div>
}