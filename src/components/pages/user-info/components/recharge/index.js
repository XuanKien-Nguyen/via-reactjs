import React, {useState} from 'react'
import {Tabs, message} from 'antd';
import './style.scss'
import Bank from './components/bank'
import USTD from './components/ustd'
const {TabPane} = Tabs;

export default ({loading}) => {

    const [currentTab, setCurrentTab] = useState('ustd')

    const copy = val => {
        message.success('Sao chép thành công')
        navigator.clipboard.writeText(val);
    }

    return <div>
        <Tabs onChange={tab => setCurrentTab(tab)} type="card" activeKey={currentTab} className={'recharge-container'}>
            <TabPane tab={<img src={require('../../../../../assets/img/acb.png')} style={{
                padding: '8px',
                height: '100%',
                width: '50px'
            }} width={'50px'} alt="ACB"/>} key="bank">
                {currentTab === 'bank' && <Bank loading={loading} copy={copy} />}
            </TabPane>
            <TabPane
                tab={<img src={require('../../../../../assets/img/ustd.png')} width={'37px'} alt="USTD"/>}
                key="ustd">
                {currentTab === 'ustd' && <USTD loading={loading} copy={copy} changTab={setCurrentTab} />}
            </TabPane>
        </Tabs>
    </div>
}