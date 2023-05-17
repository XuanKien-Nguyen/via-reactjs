import {Button, Form, Input, message, Select} from 'antd'
import React, {Fragment, useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {createProduct} from "../../../services/product-manager";

const {OptGroup, Option} = Select;
const Wrapper = (props) =>{

    const {getFieldDecorator} = props.form;
    const {closePopup, setReload, categoryOptions, setPending } = props
    const handleSubmit = e =>{
        e.preventDefault();
        console.log(props.form.getFieldsValue());
        props.form.validateFields((errors, values) =>{
            if(!errors){
                setPending(true)
                let body = {
                    category_id: values.categoryId,
                    cost: values.cost,
                    product_text: values.productText
                }
                createProduct(body).then((resp) => {
                    if(resp.status === 200){
                        message.success(resp?.data?.message);
                        closePopup()
                        setReload();
                    }
                }).catch(() => message.error('Có lỗi xả ra'))
                    .finally(() =>{
                        setPending(false)
                    })
            }
        })
    }

    return <Fragment>
        <Form onSubmit={handleSubmit}>
            <Form.Item label="Danh mục">
                {getFieldDecorator('categoryId', {
                    rules: [{required: true, message: 'Vui lòng chọn danh mục'}],
                })(<Select>
                        {
                            categoryOptions().map(e => {
                                return(
                                    <OptGroup label={e.label}>
                                        {e.options.map(c =>{
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
            <Form.Item label="Mã sản phẩm">
                {getFieldDecorator('productText', {
                    rules: [{required: true, message: 'Vui lòng nhập mã sản phẩm'}],
                })(
                    <TextArea placeholder={'Mã sản phẩm'}/>,
                )}
            </Form.Item>
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