import React, {useState, Fragment, useEffect} from "react";
import {Button, Form, Icon, Input, Checkbox, message, Select, Switch, Upload, Col, Row, Tag} from "antd";
import {createCategory} from "../../../../../services/category-manager";
import {getParentCategoryList} from "../../../../../services/category/category";
import {getPropertiesProduct} from "../../../../../services/product-manager";
import {getLocationList} from "../../../../../services/category/category";
import {getBase64} from "../../../../../utils/helpers";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal"

const {Option} = Select

const Wrapper = (props) => {

    const [createChild, setCreateChild] = useState(false)
    const [initCreateChild, setInitCreateChild] = useState(true)
    const {getFieldDecorator} = props.form;
    const {updateObject} = props
    const {setVisible, reload, setPending} = props
    const [parentList, setParentList] = useState([])
    const [properties, setProperties] = useState(null)
    const [locationList, setLocationList] = useState([])

    const [checkPointEmail, setCheckPointEmail] = useState(false)
    const [hasChange, setHasChange] = useState(false)
    const [has2Fa, setHas2Fa] = useState(false)
    const [hasEmail, setHasEmail] = useState(false)
    const [hasBackup, setHasBackup] = useState(false)
    const [formatErr, setFormatErr] = useState('')

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    const [format, setFormat] = useState(['', '', '', '', '', '', '', '', '', ''])

    useEffect(() => {
        const init = async () => {
            const resp = await getParentCategoryList()
            if (resp.status === 200) {
                setParentList(resp?.data?.parentCategoryList || [])
            }
            const respProp = await getPropertiesProduct()
            if (respProp.status === 200) {
                setProperties(respProp?.data?.properties)
            }

            const respLocation = await getLocationList()
            if (respLocation.status === 200) {
                setLocationList(respLocation?.data?.nationalFlagList || [])
            }
            setInitCreateChild(false)
        }
        init()
    }, [])

    useEffect(() => {
        console.log('is update', updateObject);
        if (updateObject) {
          console.log('is update', updateObject);
          setVisible(true)
      } else {
          setVisible(false)
      }
    }, [updateObject])

    useEffect(() => {
        setFormat(['', '', '', '', '', '', '', '', '', ''])
        setFormatErr('')
        setCheckPointEmail(false)
        setHasChange(false)
        setHas2Fa(false)
        setHasEmail(false)
        setHasBackup(false)
        setCreateChild(false)
    }, [props.visible])

    useEffect(() => {
        setFormat(['', '', '', '', '', '', '', '', '', ''])
        setFormatErr('')
        setCheckPointEmail(false)
        setHasChange(false)
        setHas2Fa(false)
        setHasEmail(false)
        setHasBackup(false)
    }, [createChild])

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                let body
                if (!createChild) {
                    body = values
                } else {
                    if (format.includes('')) {
                        setFormatErr('Vui lòng không bỏ trống định dạng')
                        return
                    }
                    const raw = {
                        ...values,
                        category_image: values.category_image[0].originFileObj,
                        checkpoint_email: checkPointEmail,
                        has_change: hasChange,
                        has_2fa: has2Fa,
                        has_email: hasEmail,
                        has_backup: hasBackup,
                        format: format.join('|')
                    }
                    const formData = new FormData()
                    Object.keys(raw).forEach(k => formData.append(k, raw[k]))
                    body = formData
                }
                setPending(true)
                createCategory(body).then(resp => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp?.data?.message,
                            onOk: () => {}})
                        setVisible(false)
                        reload()
                        if (!createChild) {
                            parentList.push(resp?.data?.newParentCategory)
                        }
                    }
                }).catch(err => Modal.error({
                        content: err?.response?.data?.message,
                        onOk: () => {}}))
                    .finally(() => setPending(false))
            }
        });
    };

    const onChangeFormat = (idx, value) => {
        format[idx] = value
        setFormat([...format])
        setFormatErr('')
    }

    const renderFormat = () => {
        let text = ''
        format.forEach((el, idx) => {
            if (el === '') {
                text += `{${idx + 1}}|`
            } else {
                text += `${el}|`
            }
        })
        return <Tag color="geekblue" style={{
            margin: '10px 0px',
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '4px',
            maxWidth: 'fit-content'
        }}>
            Định dạng: <span style={{
            color: 'red',
            display: 'block',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            width: 'calc(100% - 64px)'
        }}>{text.substr(0, text.length - 1)}</span>
        </Tag>
    }

    const normFile = e => {
        if (e.fileList.length > 1) {
            e.fileList.shift();
        }
        return e && e.fileList;
    }

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    }

    const beforeUpload = (file) => {
        const extension = file.name.split('.')

        const errorFn = () => {
            const els = document.querySelector('.ant-upload-list-item-card-actions a i')
            if (els) {
                els.click()
            }
        }
        if (extension.length > 1) {
            const isJpgOrPng = extension[extension.length - 1] === 'jpg' || extension[extension.length - 1] === 'png';
            if (!isJpgOrPng) {
                Modal.error({
                    content: 'Chỉ hỗ trợ định dạng ảnh là JPG và PNG',
                    onOk: errorFn
                });
            }
            if (file.size / 1024 / 1024 > 1) {
                Modal.error({
                    content: 'Kích thước ảnh tối đa là 1Mb',
                    onOk: errorFn
                });
            }
        }
        return false
    }

    return <Fragment>
        {props.visible && <Form onSubmit={handleSubmit}>
            <Form.Item label="Tên danh mục">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: 'Vui lòng nhập tên danh mục'}],
                })(
                    <Input placeholder={'Tên danh mục'}/>,
                )}
            </Form.Item>
            <p className={'m-t-10'}>Tạo danh mục con:
                <Switch checked={createChild}
                        loading={initCreateChild}
                        onChange={v => {
                            setCreateChild(v)
                        }}
                />
            </p>

            {createChild && <Fragment>
                <Form.Item label="Danh mục cha">
                    {getFieldDecorator('parent_id', {
                        rules: [{required: true, message: 'Vui lòng chọn danh mục cha'}],
                    })(<Select
                        showSearch
                        placeholder="Danh mục cha"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {parentList.map(el => <Option value={el.id}>{el.name}</Option>)}
                    </Select>)}
                </Form.Item>
                <p className={'m-t-10'}>{renderFormat()}</p>
                <Row gutter={16}>
                    {properties?.map((e, idx) => {
                        return <Col sm={24} md={12} lg={4} className={'m-b-10'}>
                            <Select
                                allowClear={true}
                                onChange={e => onChangeFormat(idx, e)}
                                suffixIcon={idx + 1}
                                showSearch
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {properties?.map(el => <Option disabled={format.includes(el)} value={el}>{el}</Option>)}
                            </Select>
                        </Col>
                    })}
                </Row>
                {<p style={{color: 'red'}}>{formatErr}</p>}
                <Form.Item label="Đơn giá">
                    {getFieldDecorator('price', {
                        rules: [{required: true, message: 'Vui lòng nhập đơn giá'}],
                    })(
                        <Input type={'number'} placeholder={'Đơn giá'}/>,
                    )}
                </Form.Item>
                <Row>
                    <Col span={8}>
                        <Checkbox checked={checkPointEmail} onChange={e => setCheckPointEmail(e.target.checked)}>Check
                            Point Email</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={hasChange} onChange={e => setHasChange(e.target.checked)}>Đổi thông
                            tin</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={has2Fa} onChange={e => setHas2Fa(e.target.checked)}>Xác thực 2FA</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={hasEmail} onChange={e => setHasEmail(e.target.checked)}>Email</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox checked={hasBackup} onChange={e => setHasBackup(e.target.checked)}>Backup</Checkbox>
                    </Col>
                </Row>
                <Form.Item label="Bạn bè">
                    {getFieldDecorator('number_friend', {
                        rules: [{required: true, message: 'Vui lòng nhập bạn bè'}],
                    })(
                        <Input placeholder={'Bạn bè'}/>,
                    )}
                </Form.Item>
                <Form.Item label="Quốc gia">
                    {getFieldDecorator('location', {
                        rules: [{required: true, message: 'Vui lòng chọn quốc gia'}],
                    })(<Select
                        showSearch
                        placeholder="Quốc gia"
                        // filterOption={(input, option) =>
                        //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                    >
                        {locationList.map(el => <Option value={el.name}>
                            <div style={{display: 'flex', alignItems: 'center'}}><img
                                style={{width: '20px', marginRight: '8px'}} src={el.path} alt=""
                                className="src"/>{el.name}</div>
                        </Option>)}
                    </Select>)}
                </Form.Item>
                <Form.Item label="Thời gian">
                    {getFieldDecorator('time', {
                        rules: [{required: true, message: 'Vui lòng nhập thời gian'}],
                    })(
                        <Input placeholder={'Thời gian'}/>,
                    )}
                </Form.Item>
                <Form.Item label="Mô tả">
                    {getFieldDecorator('description', {
                        rules: [{required: true, message: 'Vui lòng nhập mô tả'}],
                    })(
                        <TextArea placeholder={'Mô tả'} rows={4}/>,
                    )}
                </Form.Item>
                <Form.Item label="Hình ảnh">
                    {getFieldDecorator('category_image', {
                        valuePropName: 'fileList',
                        getValueFromEvent: normFile,
                        rules: [{required: true, message: 'Vui chọn file'}],
                    })(
                        <Upload.Dragger
                            name="files"
                            multiple={false}
                            beforeUpload={beforeUpload}
                            accept={'.png, .jpg'}
                            onPreview={handlePreview}
                            // disabled={props.form.getFieldValue('category_image')?.length > 0 || false}
                            listType="picture"
                            id={'upload-file-category'}
                        >
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                            <p className="ant-upload-hint">Hỗ trợ định dạng JPG, PNG</p>
                            <p className="ant-upload-hint">Tải lên tối đa 1 file, dung lượng tối đa 1MB</p>
                        </Upload.Dragger>,
                    )}
                    <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                        <img style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>
            </Fragment>}
            <Button id={'submit-create-category'} type="primary" htmlType="submit" hidden></Button>
        </Form>}
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
