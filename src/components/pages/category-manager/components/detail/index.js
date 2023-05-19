import React from "react";
import {Icon, Modal, Table, Tag, Row, Col, Button} from "antd";
import {convertCurrencyVN} from "../../../../../utils/helpers";
import {deleteCategory} from "../../../../../services/category-manager";

export default ({datasource, loading, reload, setUpdateObject}) => {

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
            width: '400px',
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
                            content: resp?.data?.message,
                            onOk: reload
                        })
                    }
                }).catch(err => Modal.error({
                    content: err?.response?.data?.message,
                    onOk: () => {}
                })).finally(() => loading(false))
            },
            onCancel: () => {}
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
                        <p style={{textAlign: 'right', marginBottom: '0px'}}><img width={'25px'} src={el.location_img_url} alt="" className="src"/></p>
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
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Trạng thái: </Col>
                    <Col xs={12}>
                        {el.status === 'show' ? 'Hiển thị' : 'Ẩn'}
                    </Col>
                </Row>
                <hr style={{margin: '5px 0px'}}/>
                <Row>
                    <Col xs={12}>Người tạo: </Col>
                    <Col xs={12}>
                        {el.createdby}
                    </Col>
                </Row>
            </div>
        } else
            return '-'
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: v => `#${v}`,
            width: '150px',
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            width: '150px',
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
                <img alt="recharge-tickets" src={image_url} />
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
                <Col xs={12} style={{textAlign: 'right'}}>
                    <Button type={'primary'} onClick={() => setUpdateObject(el)}>
                        <Icon type='edit'/>
                    </Button>
                </Col>
                <Col xs={12} style={{textAlign: 'left'}}>
                    <Button type={'danger'} onClick={() => handleDelete(el)}>
                        <Icon type='delete'/>
                    </Button>
                </Col>
            </Row>,
            fixed: 'right',
            width: '130px'
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

    return <Table bordered
                  scroll={{ x: true }}
                  columns={columns}
                  dataSource={ds}
                  locale={{emptyText: 'Không có dữ liệu'}}
                  rowKey={'id'}
                  indentSize={40}
                  pagination={false}
    />

}