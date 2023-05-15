import React, {useState, Fragment, useContext, useEffect} from "react";
import {Button, Form, Icon, Input, Checkbox, message, Select, Switch, Upload, Col, Row, Tag} from "antd";
import {createCategory} from "../../../../../services/category-manager";
import {getParentCategoryList} from "../../../../../services/category/category";
import {getPropertiesProduct} from "../../../../../services/product-manager";
import {getLocationList} from "../../../../../services/category/category";
import TextArea from "antd/es/input/TextArea";

const {Option} = Select

const Wrapper = (props) => {

    const [createChild, setCreateChild] = useState(false)
    const {getFieldDecorator} = props.form;
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
        }
        init()
    }, [])

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
            if (format.includes('')) {
                setFormatErr('Vui lòng không bỏ trống định dạng')
                return
            }
            if (!err && !format.includes('')) {
                setPending(true)
                createCategory(values).then(resp => {
                    if (resp.status === 200) {
                        message.success(resp?.data?.message)
                        setVisible(false)
                        reload()
                    }
                }).catch(err => message.error(err?.response?.data?.message))
                    .finally(() => setPending(false))
                console.log('Received values of form: ', values);
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
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return <Fragment>
        {props.visible && <Form onSubmit={handleSubmit}>
            <Form.Item label="Tên danh mục">
                {getFieldDecorator('name', {
                    rules: [{required: true, message: 'Vui lòng nhập tên danh mục'}],
                })(
                    <Input placeholder={'Tên danh mục'}/>,
                )}
            </Form.Item>
            <p className={'m-t-10'}>Tạo danh mục con: <Switch checked={createChild} onChange={v => setCreateChild(v)}/>
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
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
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
                    })(
                        <Upload.Dragger name="files" customRequest={() => Promise.resolve()}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                            <p className="ant-upload-hint">Hỗ trợ định dạng JPG, PNG</p>
                        </Upload.Dragger>,
                    )}
                </Form.Item>
            </Fragment>}
            <Button id={'submit-create-category'} type="primary" htmlType="submit" hidden></Button>
        </Form>}
    </Fragment>
}

const Wrapped = Form.create()(Wrapper);

export default Wrapped
