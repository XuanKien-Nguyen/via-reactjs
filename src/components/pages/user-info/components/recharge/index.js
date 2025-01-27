import React, {useState} from 'react'
import {Tabs, message} from 'antd';
import './style.scss';
import Bank from './components/bank';
import USTD from './components/ustd';
import { useTranslation } from 'react-i18next';
const {TabPane} = Tabs;

export default ({loading}) => {

    const {t} = useTranslation();

    const [currentTab, setCurrentTab] = useState('bank')

    const copy = val => {
        message.success(t('message.copy_success'))
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
                tab={<img src={require('../../../../../assets/svg/ustd-tron.svg')} style={{
                    width: '50px',
                    padding: '2px 12px'
                }} alt="USTD"/>}
                key="ustd">
                {currentTab === 'ustd' && <USTD loading={loading} copy={copy} changTab={setCurrentTab} />}
            </TabPane>
        </Tabs>
    </div>
}