import React, {useEffect, useState} from "react";
import {Button, Col, Icon, Modal, Row, Table, Tag, Tooltip} from "antd";
import {convertCurrencyVN} from "../../../../../utils/helpers";
import {deleteCategory, updateCategory} from "../../../../../services/category-manager";

let mouseDown = false;
let startX, scrollLeft, slider, startDragging, stopDragging, handleDragging;
export default ({datasource, loading, reload, setUpdateObject, setVisible}) => {

    const [count, setCount] = useState(0)

    useEffect(() => {
        // if (!slider) {
        slider = document.querySelector('.ant-table-body');
        // }
        setTimeout(() => {
            startDragging = (e) => {
                mouseDown = true;
                startX = e.pageX;
                scrollLeft = slider.scrollLeft;
            };
            stopDragging = () => {
                mouseDown = false;
            };

            handleDragging = (e) => {
                e.preventDefault();
                if (!mouseDown) {
                    return;
                }
                const x = e.pageX - slider.offsetLeft;
                const scroll = x - startX;
                slider.scrollLeft = scrollLeft - scroll;
            }

            slider.addEventListener('mousemove', handleDragging);
            slider.addEventListener('mousedown', startDragging, false);
            slider.addEventListener('mouseup', stopDragging, false);
            slider.addEventListener('mouseleave', stopDragging, false);
        }, 500)
        return () => {
            slider.removeEventListener('mousemove', handleDragging);
            slider.removeEventListener('mousedown', startDragging, false);
            slider.removeEventListener('mouseup', stopDragging, false);
            slider.removeEventListener('mouseleave', stopDragging, false);
        }
    }, [])

    const ds = datasource.map(el => {
        const data = {
            ...el,
            children: el.childCategoryList
        }
        // if (data.children.length === 0) {
        //     delete data.children
        // }
        return data
    })

    const handleDelete = el => {
        Modal.confirm({
            content: <p>Bạn có chắc chắn muốn xoá danh mục <br/><b>#{el.id} - {el.name}</b>?</p>,
            width: '500px',
            cancelText: 'Huỷ',
            okText: 'Xoá',
            okButtonProps: {
                type: 'danger'
            },
            onOk: () => {
                loading(true)
                deleteCategory(el.id).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            width: '400px',
                            content: resp?.data?.message,
                            onOk: reload
                        })
                    }
                }).catch(err => Modal.error({
                    width: '700px',
                    content: err?.response?.data?.message,
                    onOk: () => {
                    }
                })).finally(() => loading(false))
            },
            onCancel: () => {
            }
        })
    }

    const handleChangeStatus = el => {
        Modal.confirm({
            content: <p>Bạn có chắc chắn muốn {el.status === 'show' ? <b style={{color: 'red'}}>Ẩn</b> : <b style={{color: 'red'}}>Hiển thị</b>} danh mục <b>#{el.id} - {el.name}?</b>
                </p>,
            width: '500px',
            cancelText: 'Huỷ',
            okText: 'Đổi trạng thái',
            okButtonProps: {
                type: 'primary'
            },
            onOk: () => {
                loading(true)
                updateCategory(el.id, {status: el.status === 'show' ? 'hide' : 'show'}).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            width: '500px',
                            content: resp?.data?.message,
                            onOk: reload
                        })
                    }
                }).catch(err => Modal.error({
                    width: '700px',
                    content: err?.response?.data?.message,
                    onOk: () => {
                    }
                })).finally(() => loading(false))
            },
            onCancel: () => {
            }
        })
    }

    const renderDetail = (el) => {
        if (el) {
            return <div>
                <Row>
                    <Col xs={12}>Số lượng:</Col>
                    <Col xs={12}>
                        {el.sum_via}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Đã bán:</Col>
                    <Col xs={12}>
                        {el.sold_via}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Quốc gia:</Col>
                    <Col xs={12}>
                        <p style={{textAlign: 'right', marginBottom: '0px', display: 'inline-flex'}}>
                            <img width={'20px'}
                                 height={'20px'}
                                 src={el.location_img_url}
                                 alt=""
                                 className="src"/>
                            <span
                                style={{
                                    lineHeight: '22px',
                                    paddingLeft: '10px'
                                }}>  {'  ' + el.location}</span>
                        </p>
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Ngày lập:</Col>
                    <Col xs={12}>
                        {el.time}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Xác thực 2FA:</Col>
                    <Col xs={12}>
                        {el.has_2fa === true ? `Có` : `Không`}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Bạn bè: </Col>
                    <Col xs={12}>
                        {el.number_friend}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Checkpoint Email: </Col>
                    <Col xs={12}>
                        {el.checkpoint_email === true ? `Có` : `Không`}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Email: </Col>
                    <Col xs={12}>
                        {el.has_email === true ? `Có` : `Không`}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Đổi thông tin: </Col>
                    <Col xs={12}>
                        {el.has_change === true ? `Có` : `Không`}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Hỗ trợ Backup: </Col>
                    <Col xs={12}>
                        {el.has_backup === true ? `Có` : `Không`}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Định dạng: </Col>
                    <Col xs={12}>
                        <a onClick={() => Modal.info({
                            maskClosable: true,
                            width: '1000px',
                            content: <div>
                                <b>Định dạng: <Tag color="geekblue">{el.format}</Tag></b>
                            </div>
                        })}>Xem định dạng</a>
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Mô tả: </Col>
                    <Col xs={12}>
                        {el.description}
                    </Col>
                </Row>
                {/*<hr style={{margin: '5px 0px'}}/>*/}
                {/*<Row>*/}
                {/*    <Col xs={12}>Trạng thái: </Col>*/}
                {/*    <Col xs={12}>*/}
                {/*        {el.status === 'show' ? 'Hiển thị' : 'Ẩn'}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<hr style={{margin: '5px 0px'}}/>*/}
                {/*<Row>*/}
                {/*    <Col xs={12}>Người tạo: </Col>*/}
                {/*    <Col xs={12}>*/}
                {/*        {el.createdby}*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </div>
        } else
            return '-'
    }

    const columns = [
        {
            title: 'ID',
            render: el => {
                if (el.parent_id) {
                    return <p style={{textAlign: 'right'}}><b>#{el.parent_id}</b> <Icon type="caret-right" /> <i>#{el.id}</i></p>
                }
                return <span><b> #{el.id}</b>   ({el.childCategoryList?.length || 0})</span>
            },
            width: '200px',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '150px',
            render: status => {
                return <Tag color={status === 'show' ? 'blue' : 'red'}>{status === 'show' ? 'Hiển thị' : 'Ẩn'}</Tag>
            },
            align: 'center',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: v => v ? <b>{convertCurrencyVN(v)}</b> : '-',
            width: '150px',
            align: 'center',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image_url',
            render: image_url => image_url ? <div className="recharge-tickets_image">
                <img alt="recharge-tickets" src={image_url}/>
                <Icon type='eye' style={{color: 'white', fontSize: '24px'}} onClick={() => onShowImage(image_url)}/>
            </div> : '-',
            width: '270px',
            align: 'center',
        },
        {
            title: 'Chi tiết',
            render: el => el.parent_id === null ? '-' : renderDetail(el),
            width: '500px',
        },
        {
            title: 'Người tạo',
            render: el => el.createdby,
            width: '150px',
            align: 'center'
        },
        {
            title: 'Thời gian tạo',
            render: el => el.created_time,
            width: '200px',
            align: 'center'
        },
        {
            title: 'Người cập nhật',
            render: el => el.updatedby ? el.updatedby : '-',
            width: '150px',
            align: 'center'
        },
        {
            title: 'Thời gian cập nhật',
            render: el => el.updated_time ? el.updated_time : '-',
            width: '200px',
            align: 'center'
        },
        {
            title: 'Thao tác',
            align: "center",
            render: el => <Row gutter={5}>
                <Col xs={8} style={{textAlign: 'right'}}>
                    <Tooltip title={'Cập nhật'}>
                        <Button type={'primary'} onClick={() => {
                            setUpdateObject(el)
                            setVisible(true)
                        }}>
                            <Icon type='edit'/>
                        </Button>
                    </Tooltip>
                </Col>
                <Col xs={8}>
                    <Tooltip title={'Đổi trạng thái'}>
                        <Button type={'ghost'} onClick={() => handleChangeStatus(el)}>
                            <Icon type="sync" />
                        </Button>
                    </Tooltip>
                </Col>
                <Col xs={8} style={{textAlign: 'left'}}>
                    <Tooltip title={'Xoá'}>
                        <Button type={'danger'} onClick={() => handleDelete(el)}>
                            <Icon type='delete'/>
                        </Button>
                    </Tooltip>
                </Col>
            </Row>,
            fixed: 'right',
            width: '200px'
        },
    ]

    const onShowImage = (url) => {
        Modal.info({
            className: "recharge-tickets-image_modal",
            width: '700px',
            content: <div><img alt="recharge-tickets" src={url}/></div>,
            maskClosable: true,
        })
    }

    const customExpandIcon = (props) => {
        if (props.expanded) {
            const parentElement = document.querySelector(`[data-row-key='${props.record.id}']`);
            if (parentElement) {
                parentElement.style.backgroundColor = '#e6f7ff'
            }
            // props.record.children.forEach(el => {
            //    const element = document.querySelector(`[data-row-key='${el.id}']`);
            //    if (element) {
            //        element.style.backgroundColor = '#e6f7ff'
            //    }
            // })
            return <a onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else if(props.record.children){
            const parentElement = document.querySelector(`[data-row-key='${props.record.id}']`);
            if (parentElement) {
                parentElement.style.backgroundColor = ''
            }
            // props.record.children.forEach(el => {
            //     const element = document.querySelector(`[data-row-key='${el.id}']`);
            //     if (element) {
            //         element.style.backgroundColor = '#e6f7ff'
            //     }
            // })
            return <a onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
        return ''
    }

    return <Table bordered
                  expandIcon={customExpandIcon}
                  scroll={{x: true}}
                  columns={columns}
                  dataSource={ds}
                  locale={{emptyText: 'Không có dữ liệu'}}
                  rowKey={'id'}
                  indentSize={40}
                  pagination={false}
        // fix bug bị vỡ form khi expand row
                  onExpand={() => {
                      setTimeout(() => {
                          setCount(count + 1)
                      }, 100)
                  }}
    />

}