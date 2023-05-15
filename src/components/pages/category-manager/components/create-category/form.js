import React, {useState, Fragment, useContext, useEffect} from "react";
import {Button, Form, Icon, Input, InputNumber, message, Select, Switch, Upload} from "antd";
import {createCategory} from "../../../../../services/category-manager";
import {getParentCategoryList} from "../../../../../services/category/category";

const {Option} = Select

const Wrapper = (props) => {

    const [createChild, setCreateChild] = useState(false)
    const { getFieldDecorator } = props.form;
    const {setVisible, reload, setPending} = props
    const [parentList, setParentList] = useState([])

    useEffect(() => {
    }, [props.visible])

    useEffect(() => {
        getParentCategoryList().then(resp => {
            if (resp.status === 200) {
                setParentList(resp?.data?.parentCategoryList || [])
            }
        })
    }, [])

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
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

    return <Fragment>
        {props.visible && <Form onSubmit={handleSubmit}>
            <Form.Item label="Tên danh mục">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Vui lòng nhập tên danh mục' }],
                })(
                    <Input placeholder={'Tên danh mục'}/>,
                )}
            </Form.Item>
            <p>Tạo danh mục con: <Switch checked={createChild} onChange={v => setCreateChild(v)}/></p>

            {createChild && <Fragment>
                {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: 'Vui lòng nhập tên danh mục cha' }],
                })(<Select
                    showSearch
                    placeholder="Danh mục cha"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {parentList.map(el => <Option value={el.id}>{el.name}</Option>)}
                </Select>)}
                <Form.Item label="Hình ảnh">
                    {getFieldDecorator('category_image', {
                        valuePropName: 'fileList',
                    })(
                        <Upload.Dragger name="files" action="/upload.do">
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                            <p className="ant-upload-hint">Hỗ trợ định dạng ảnh</p>
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
