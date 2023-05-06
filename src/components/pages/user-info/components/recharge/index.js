import React, {useState} from 'react'
import {Tabs, Button, message} from 'antd';
import Input from "antd/es/input";
import './style.scss'
import {getSyntaxToTopupBanking} from "../../../../../services/recharge";

const { TabPane } = Tabs;
const { Search } = Input;

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

    return  <Tabs onChange={changeTab} type="card" className={'recharge-container'}>
        <TabPane tab="Tab 1" key="bank">
            <div>
                {/*<Input type={'number'} value={money} onChange={e => setMoney(e.target.value)}/>*/}
                {/*<Button type={'primary'}>Nạp tiền</Button>*/}
                <Search
                    placeholder="Nhập số tiền muốn nạp"
                    enterButton="Nạp"
                    type={'number'}
                    size="default"
                    onSearch={handleRecharge}
                />
            </div>
            {rechargeInfo && <div dangerouslySetInnerHTML={{__html: rechargeInfo.Qrcode}}/>}
        </TabPane>
        <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
        </TabPane>
        {/*<TabPane tab="Tab 3" key="3">*/}
        {/*    Content of Tab Pane 3*/}
        {/*</TabPane>*/}
    </Tabs>
}