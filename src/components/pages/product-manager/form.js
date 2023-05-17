import {Button, Form, Input, message, Select} from 'antd'
import React, {Fragment, useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {createProduct} from "../../../services/product-manager";
import Modal from "antd/es/modal";

const {OptGroup, Option} = Select;
const Wrapper = (props) => {

    const {getFieldDecorator} = props.form;
    const {closePopup, setReload, categoryOptions, setPending, visible} = props
    const handleSubmit = e => {
        e.preventDefault();
        console.log(props.form.getFieldsValue());
        props.form.validateFields((errors, values) => {
            if (!errors) {
                setPending(true)
                let body = {
                    category_id: values.categoryId,
                    cost: values.cost,
                    product_text: values.productText
                }
                createProduct(body).then((resp) => {
                    if (resp.status === 200) {
                        Modal.success({
                            content: resp?.data?.message,
                            onOk: () => {
                                closePopup()
                                setReload();
                            }})
                    }
                }).catch(() => message.error('Có lỗi xả ra'))
                    .finally(() => {
                        setPending(false)
                    })
            }
        })
    }

    useEffect(() => {
        props.form.setFieldsValue({
            categoryId: null,
            productText: null,
            cost: null,
        })
    }, [visible])

    return <Fragment>
        <Form onSubmit={handleSubmit}>
            <Form.Item label="Danh mục">
                {getFieldDecorator('categoryId', {
                    rules: [{required: true, message: 'Vui lòng chọn danh mục'}],
                })(<Select placeholder={'Danh mục'}>
                        {
                            categoryOptions.map(e => {
                                return (
                                    <OptGroup label={e.label}>
                                        {e.options.map(c => {
                                            return (
                                                <Option value={c.value}>{c.label}</Option>
                                            )
                                        })}
                                    </OptGroup>
                                )

                            })
                        }
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="Sản phẩm">
                {getFieldDecorator('productText', {
                    rules: [{required: true, message: 'Vui lòng nhập sản phẩm'}],
                })(
                    <TextArea placeholder={'Sản phẩm'} rows={8}/>,
                )}
            </Form.Item>
            <i>Lưu ý: mỗi sản phẩm là 1 dòng</i>
            <Form.Item label="Đơn giá">
                {getFieldDecorator('cost', {
                    rules: [{required: true, message: 'Vui lòng nhập đơn giá'}],
                })(
                    <Input type={'number'} placeholder={'Đơn giá'}/>,
                )}
            </Form.Item>

            <Button id={'submit-create-product'} type="primary" htmlType="submit" hidden></Button>
        </Form>
    </Fragment>

}

const Wrapped = Form.create()(Wrapper);

export default Wrapped;