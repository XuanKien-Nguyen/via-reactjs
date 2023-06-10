import React, { useContext, useState, useEffect, Fragment } from "react";
import NumberCard from "./NumberCard";
import { Button, Icon, Tooltip, Tag, message, Modal, DatePicker, Card, Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

export default ({items}) => {

    const {t} = useTranslation();

    return (
        <Row gutter={[12, 12]}>
            <Col key={'1'} lg={6} md={12}>
                <NumberCard 
                    icon={'dollar'}
                    title={'Total Price'}
                    totalValue={items?.totalPrice || 0}
                    type="sale"
                    borderType="sale"
                />
            </Col>
            <Col key={'2'} lg={6} md={12}>
                <NumberCard 
                    icon={'stock'}
                    title={'Total Profit'}
                    totalValue={items?.totalProfit || 0}
                    type="sale"
                    borderType="sale"
                />
            </Col>
            <Col key={'3'} lg={6} md={12}>
                <NumberCard 
                    icon={'stock'}
                    title={'Final Profit'}
                    totalValue={items?.finalProfit || 0}
                    type="sale"
                    borderType="sale"
                />
            </Col>
            <Col key={'4'} lg={6} md={12}>
                <NumberCard 
                    icon={'inbox'}
                    title={'Total Product Sale'}
                    totalValue={items?.totalProductToSale || 0}
                    borderType="sale"
                />
            </Col>
            <Col key={'5'} lg={6} md={12}>
                <NumberCard 
                    icon={'dropbox'}
                    title={'Total Product Replace'}
                    totalValue={items?.totalProductToReplace || 0}
                    type="product"
                    borderType="replace"
                />
            </Col>
            <Col key={'6'} lg={6} md={12}>
                <NumberCard 
                    icon={'sync'}
                    title={'Total Cost Replace'}
                    totalValue={items?.totalCostReplace || 0}
                    borderType="replace"
                />
            </Col>
            <Col key={'6'} lg={6} md={12}>
                <NumberCard 
                    icon={'issues-close'}
                    title={'Total Amount Refund'}
                    totalValue={items?.totalAmountRefund || 0}
                    borderType="refund"
                />
            </Col>
            <Col key={'6'} lg={6} md={12}>
                <NumberCard 
                    icon={'issues-close'}
                    title={'Total Bonus Refund'}
                    totalValue={items?.totalBonusRefund || 0}
                    borderType="refund"
                />
            </Col>
        </Row>
    )
}