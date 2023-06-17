import React, { useContext, useState, useEffect, Fragment } from "react";
import NumberCard from "./components/NumberCard";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import {getUserListForAdmin} from "../../../services/user-manager";
import {getAllRechargeSuccess} from "../../../services/recharge-manager";
import {getAllStatistics} from "../../../services/statistics-manager";
import moment from "moment";
import "./index.scss";

const dateFormat = 'YYYY-MM-DD';

const timeFormat = 'DD-MM-YYYY hh:mm:ss'

export default () => {

    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)

    const [dsUser, setDsUser] = useState(null)
    const [dsRechargeSuccess, setDsRechargeSuccess] = useState(null)
    const [dsProfit, setDsProfit] = useState(null)

    const [reload, setReload] = useState(0)

    useEffect(() => {
        const date = moment();
        let created_time = JSON.stringify([...Array(2).fill(date.format(dateFormat))]);

        setLoading(true)
        const getDashBoard = async () => {
            await Promise.all([
              getUserListForAdmin({created_time}).then(resp => {
                if (resp?.data) {
                    const data = resp.data
                    setDsUser(data)
                }
              }),
              getAllRechargeSuccess({created_time}).then(resp => {
                if (resp?.data) {
                    const data = resp.data
                    setDsRechargeSuccess(data)
                }
              }),
              getAllStatistics({created_time}).then(resp => {
                if (resp?.data) {
                  const data = resp.data
                  setDsProfit(data)
                }
              })
            ]);
            setLoading(false)
          };
          getDashBoard()
    }, [])

    return <div>
        {user && <Fragment>
            <Row gutter={[16, 6]}>
                <Col key={'1'} xxl={6} xl={12} sm={24}>
                  <NumberCard
                      icon={'user'}
                      title={'Tổng người dùng đăng ký'}
                      totalValue={dsUser?.totalUsers || 0}
                      borderType="user"
                      updateTime={moment().format(timeFormat)}
                  />
                </Col>
                <Col key={'2'} xxl={6} xl={12} sm={24}>
                    <NumberCard
                        icon={'dollar'}
                        title={'Tổng lượt nạp tiền thành công'}
                        totalValue={dsRechargeSuccess?.totalSuccessRecharge || 0}
                        borderType="recharge-success"
                        updateTime={moment().format(timeFormat)}
                    />
                </Col>
                <Col key={'3'} xxl={6} xl={12} sm={24}>
                    <NumberCard
                        icon={'stock'}
                        title={'Tổng doanh thu'}
                        totalValue={dsProfit?.totalProfit || 0}
                        borderType="total-profit"
                        type="profit"
                        updateTime={moment().format(timeFormat)}
                    />
                </Col>
                <Col key={'4'} xxl={6} xl={12} sm={24}>
                    <NumberCard
                        icon={'rise'}
                        title={'Tổng lợi nhuận'}
                        totalValue={dsProfit?.finalProfit || 0}
                        borderType="final-profit"
                        type="profit"
                        updateTime={moment().format(timeFormat)}
                    />
                </Col>
            </Row>
        </Fragment>}
    </div>
}