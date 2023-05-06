import React, {useState, Fragment} from 'react'
import {Tabs, Button, message} from 'antd';
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

    return <div>
        <Tabs onChange={changeTab} type="card" className={'recharge-container'}>
            <TabPane tab={<img src={require('../../../../../assets/img/acb.png')} style={{
                padding: '8px',
                height: '100%',
                width: '50px'
            }} width={'50px'} alt="ACB"/>} key="bank">
                <div>
                    <Search
                        placeholder="Nhập số tiền muốn nạp"
                        enterButton="Nạp"
                        type={'number'}
                        size="default"
                        onSearch={handleRecharge}
                    />
                </div>
                {rechargeInfo && <Fragment><h1 className={'m-t-10 m-b-10'}>Nạp tiền tự động</h1>
                    <p className={'m-t-10 m-b-10'}><i style={{color: 'blue'}}>Vui lòng chuyển khoản vào tài khoản với nội dung bên dưới</i></p>
                    <div dangerouslySetInnerHTML={{__html: rechargeInfo.Qrcode}}/>
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