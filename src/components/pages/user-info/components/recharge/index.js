import React, {useState, Fragment} from 'react'
import {Tabs, Button, message, Row, Col} from 'antd';
import Input from "antd/es/input";
import './style.scss'
import {getSyntaxToTopupBanking} from "../../../../../services/recharge";

const {TabPane} = Tabs;
const {Search} = Input;

export default ({loading}) => {

    const [currentTab, setCurrentTab] = useState('bank')

    const [rechargeInfo, setRechargeInfo] = useState(null)

    const changeTab = key => setCurrentTab(key)

    const handleRecharge = val => {
        loading(true)
        getSyntaxToTopupBanking({amount: val}).then(resp => {
            if (resp.status === 200) {
                setRechargeInfo(resp.data)
            }
        }).catch(err => message.error(err.response?.data?.message || 'Có lỗi xảy ra khi lấy mã nạp: ' + err))
            .finally(() => loading(false))
    }

    const copyPayInformation = val => {
        message.success('Sao chép thành công')
        navigator.clipboard.writeText(val);
    }

    return <div>
        <Tabs onChange={changeTab} type="card" className={'recharge-container'}>
            <TabPane tab={<img src={require('../../../../../assets/img/acb.png')} style={{
                padding: '8px',
                height: '100%',
                width: '50px'
            }} width={'50px'} alt="ACB"/>} key="bank">
                <div>
                    <h1>Nhập số tiền muốn nạp: </h1>
                    <Search
                        placeholder="Nhập số tiền muốn nạp"
                        enterButton="Nạp"
                        type={'number'}
                        size="default"
                        step={1000}
                        onSearch={handleRecharge}
                    />
                </div>
                {rechargeInfo && <Fragment><h1 className={'m-t-10 m-b-10'}>Nạp tiền tự động</h1>
                    <p className={'m-t-10 m-b-10'}><i style={{color: 'blue'}}>Vui lòng chuyển khoản vào tài khoản với nội dung bên dưới</i></p>

                    <div style={{display: "flex"}}>

                        <div style={{width: "50%", padding: "10px", borderRight: '1px solid #eaeaea'}}>
                            <div style={{height: '40px',
                                backgroundColor: '#EFF8FF',
                                textAlign: 'center',
                                padding: '5px',
                                fontWeight: '900'}}>
                                <h1 style={{fontWeight: 'bold'}}>Nạp tiền qua chuyển khoản</h1></div>
                            <Row className={'recharge-bank-information'}>
                                <Col span={8}>Ngân Hàng</Col>
                                <Col span={10}><span style={{color: "red"}}>ACB</span></Col>
                                <Col className={'recharge-bank-information-copy'} onClick={() => copyPayInformation('ACB')} span={6}>Sao chép</Col>
                            </Row>
                            <Row className={'recharge-bank-information'}>
                                <Col span={8}>Tên chủ tài khoản</Col>
                                <Col span={10}><span style={{color: "red"}}>{rechargeInfo.accountNameBanking}</span></Col>
                                <Col span={6} className={'recharge-bank-information-copy'} onClick={() => copyPayInformation(rechargeInfo.accountNameBanking)}>Sao chép</Col>
                            </Row>
                            <Row className={'recharge-bank-information'}>
                                <Col span={8}>Số tài khoản</Col>
                                <Col span={10}><span style={{color: "red"}}>{rechargeInfo.accountNumberBanking}</span></Col>
                                <Col span={6} className={'recharge-bank-information-copy'} onClick={() => copyPayInformation(rechargeInfo.accountNumberBanking)}>Sao chép</Col>
                            </Row>
                            <Row className={'recharge-bank-information'}>
                                <Col span={8}>Nội dung chuyển khoản</Col>
                                <Col span={10}><span style={{color: "red"}}>{rechargeInfo.systax}</span></Col>
                                <Col span={6} className={'recharge-bank-information-copy'} onClick={() => copyPayInformation(rechargeInfo.systax)}>Sao chép</Col>
                            </Row>

                        </div>

                        <div style={{width: "50%", padding: "10px"}}>
                            <div style={{height: '40px',
                                backgroundColor: '#EFF8FF',
                                textAlign: 'center',
                                padding: '5px',
                                fontWeight: '900'}}>
                                <h1 style={{fontWeight: 'bold'}}>Nạp tiền qua quét mã QR</h1></div>
                            <div style={{width: "100%", justifyContent: "center", display: 'flex', paddingBottom: '30px', borderBottom: '1px solid #eaeaea', marginTop: '10px'}}>
                                <div style={{width: "300px"}} dangerouslySetInnerHTML={{__html: rechargeInfo.Qrcode}}/>
                            </div>

                            <div id="payQRTutorial">
                                <div className={'pay-item'}>
                                    <h1 style={{fontSize: '20px', fontWeight: "bold"}}>Hướng dẫn nạp tiền qua mã QR</h1>
                                </div>
                                <div className={'pay-item'}>
                                    <span>1. Đăng nhập ứng dụng Mobile Banking, chọn chức năng Scan QR và quét mã QR trên đây.</span>
                                </div>
                                <div className={'pay-item'}>
                                    <span>2. Nhập số tiền muốn nạp, kiểm tra thông tin đơn hàng (NH, chủ TK, số TK, Nội dung CK) trùng khớp với thông tin CK bên trái</span>
                                </div>
                                <div className={'pay-item'}>
                                    <span>3. Xác nhận thanh toán và hoàn tất giao dịch</span>
                                </div>
                                <div className={'pay-item'}>
                                    <span style={{color: 'red'}}>*Chú ý: mỗi mã QR chỉ dùng cho 1 giao dịch nạp tiền, không sử dụng lại</span>
                                </div>
                            </div>
                        </div>
                    </div>


                </Fragment>}
            </TabPane>
            <TabPane
                tab={<img src={require('../../../../../assets/img/ustd.png')} width={'37px'} alt="USTD"/>}
                key="2">
                <b>USTD</b>
            </TabPane>
            {/*<TabPane tab="Tab 3" key="3">*/}
            {/*    Content of Tab Pane 3*/}
            {/*</TabPane>*/}
        </Tabs>
    </div>
}