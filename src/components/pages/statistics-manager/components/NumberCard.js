import React from 'react';
import { Icon, Card } from "antd";
import { useTranslation } from "react-i18next";
import { convertCurrencyVN } from "../../../../utils/helpers";

export default ({ icon, title, totalValue, type = '', borderType = ''}) => {

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
        <Card
            className={`overview-card ${borderType}`}
            bodyStyle={{ padding: 10 }}
        >
            <span className={'overview-card-icon'}>
                <Icon type={icon} style={{fontSize: '52px'}}></Icon>
            </span>
            <div className='overview-card-body'>
                <p className='overview-card-title'>{title || 'No Title'}</p>
                <p className='overview-card-number'>
                    {type === 'sale' ?  renderMoney(totalValue) : totalValue}
                </p>
            </div>
        </Card>
    )
}