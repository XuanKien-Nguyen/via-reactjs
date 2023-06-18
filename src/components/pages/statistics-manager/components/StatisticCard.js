import React from "react";
import NumberCard from "./NumberCard";
import { Col, Row } from "antd";

export default ({items}) => {
    return (
        <Row gutter={[12, 12]}>
            <Col key={'1'} lg={6} md={12}>
                <NumberCard 
                    icon={'dollar'}
                    title={'Tổng giá'}
                    totalValue={items?.totalPrice || 0}
                    borderType="sale"
                />
            </Col>
            <Col key={'2'} lg={6} md={12}>
                <NumberCard 
                    icon={'stock'}
                    title={'Tổng doanh thu'}
                    totalValue={items?.totalProfit || 0}
                    type="profit"
                    borderType="sale"
                />
            </Col>
            <Col key={'3'} lg={6} md={12}>
                <NumberCard 
                    icon={'stock'}
                    title={'Tổng lợi nhuận'}
                    totalValue={items?.finalProfit || 0}
                    type="profit"
                    borderType="sale"
                />
            </Col>
            <Col key={'4'} lg={6} md={12}>
                <NumberCard 
                    icon={'inbox'}
                    title={'Tổng sản phẩm bán'}
                    totalValue={items?.totalProductToSale || 0}
                    borderType="sale"
                />
            </Col>
            <Col key={'5'} lg={6} md={12}>
                <NumberCard 
                    icon={'dropbox'}
                    title={'Tổng sản phẩm đổi trả'}
                    totalValue={items?.totalProductToReplace || 0}
                    borderType="replace"
                />
            </Col>
            <Col key={'6'} lg={6} md={12}>
                <NumberCard 
                    icon={'sync'}
                    title={'Tổng chi phí đổi trả'}
                    totalValue={items?.totalCostReplace || 0}
                    borderType="replace"
                />
            </Col>
            <Col key={'7'} lg={6} md={12}>
                <NumberCard 
                    icon={'issues-close'}
                    title={'Tổng số dư hoàn trả'}
                    totalValue={items?.totalAmountRefund || 0}
                    borderType="refund"
                />
            </Col>
            <Col key={'8'} lg={6} md={12}>
                <NumberCard 
                    icon={'issues-close'}
                    title={'Tổng khuyến mãi hoàn trả'}
                    totalValue={items?.totalBonusRefund || 0}
                    borderType="refund"
                />
            </Col>
        </Row>
    )
}