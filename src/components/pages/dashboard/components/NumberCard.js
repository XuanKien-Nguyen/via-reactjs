import React from 'react';
import { Icon, Card } from "antd";
import { useTranslation } from "react-i18next";
import { convertCurrencyVN } from "../../../../utils/helpers";

export default ({ icon, title, totalValue, updateTime, type = '', borderType = ''}) => {

    const { t } = useTranslation();

    const renderMoney = (el, prefix = '+') => {
        if (el && (el + '').startsWith('-')) {
            return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
        } else if (el === 0) {
            return <b>0 VND</b>
        }
        return <b style={{color: 'green'}}>{`${prefix}${convertCurrencyVN(el)}`}</b>
    }

    return (
        <Card title={title} className={`dashboard-card ${borderType}`}>
            <div className='dashboard-card-body'>
                <span className={'dashboard-card-icon'}>
                    <Icon type={icon} style={{ fontSize: '52px', minWidth: '52px', minHeight: '52px' }}></Icon>
                </span>
                <span className='dashboard-card-number'>
                    {type === 'profit' ? renderMoney(totalValue) : totalValue}
                </span>
            </div>
            <div className='dashboard-card-update-time'>Cập nhật: {updateTime}</div>
        </Card>
    )
}