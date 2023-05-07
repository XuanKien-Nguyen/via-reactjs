import React, {useContext, useEffect, useState} from "react";
import UserDetail from "./components/user-detail/UserDetail";
import ChangePassword from "./components/change-password/ChangePassword";
import Enable2Fa from "./components/enable2fa/Enable2Fa";
import PurchaseList from './components/purchase/Purchase'
import PurchaseDetail from './components/purchase/components/Detail'
import Recharge from './components/recharge'
import Footer from './components/footer'
import '../../../assets/scss/user-info.scss'
import {useSelector} from "react-redux";
import {Button, Icon, Menu, Tag} from 'antd';
import {LayoutContext} from "../../../contexts";
import {useHistory, useLocation} from "react-router-dom";
import {convertCurrencyVN} from "../../../utils/helpers";

import { useTranslation } from 'react-i18next';

const UserInfo = () => {

    const { t } = useTranslation()

    const query = new URLSearchParams(window.location.search);

    const history = useHistory()

    const {setLoading} = useContext(LayoutContext)

    const user = useSelector(store => store.user)

    const [current, setCurrent] = useState(query.get('menu') || 'info')

    const location = useLocation()

    const [purchaseDetailId, setPurchaseDetailId] = useState(null)

    // useEffect(() => {
    //     history.push({search: `?menu=${current}`})
    // }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [current])

    useEffect(() => {
        const menu = query.get('menu')
        const id = query.get('id')
        if (menu === 'purchase' && id) {
            setPurchaseDetailId(id)
        } else {
            setPurchaseDetailId(null)
        }
    }, [location])

    const renderContent = () => {
        if (current === "change-password") {
            return <ChangePassword user={user} />
        } else if (current === "auth-2fa" && (user?.role === 'admin' || user?.role === 'staff')) {
            return <Enable2Fa loading={setLoading} />
        } else if (current === 'purchase') {
            if (purchaseDetailId) {
                return <PurchaseDetail id={purchaseDetailId} loading={setLoading}/>
            }
            return <PurchaseList loading={setLoading}/>
        } else if (current === 'recharge') {
            return <Recharge loading={setLoading}/>
        }
        return <UserDetail user={user} />
    }

    const changeMenu = e => {
        history.push({search: `?menu=${e.key}`})
        setCurrent(e.key)
    }

    return <div id='user_id' className='user-profile_container p-t-30'>
        <div className="sidebar">
            <div className="avatar">
                <img src={require('../../../assets/img/avatar.png')} alt="" className="src"/>
                <p>{`@${user?.username}`}<i className="id_text">{`#${user?.id}`}</i></p>
                <Tag color={user?.role === 'admin' ? 'red' : 'blue'}>{user?.role}</Tag>
                <span style={{marginTop: '10px', width: '100%', overflowWrap: 'break-word', textAlign: 'center'}}>{t('profile.balance')}: <span style={{color: 'blue'}}>{convertCurrencyVN(user?.amount_available + user?.bonus || 0)}</span></span>
            </div>

            <div className="information">
                <Menu
                    onClick={changeMenu}
                    style={{ width: 256 }}
                    defaultSelectedKeys={[current]}
                    defaultOpenKeys={['sub1']}
                    mode={'inline'}
                    theme={'light'}
                >
                    <Menu.Item key="info">
                        <Icon type="solution" />
                        {t('profile.information')}
                    </Menu.Item>
                    <Menu.Item key="purchase">
                        <Icon type="shop" />
                        {t('profile.order')}
                    </Menu.Item>
                    <Menu.Item key="recharge">
                        <Icon type="bank" />
                        {t('profile.recharge')}
                    </Menu.Item>
                    <Menu.Item key="change-password">
                        <Icon type="lock" />
                        {t('profile.change-password')}
                    </Menu.Item>
                    { (user?.role === 'admin' || user?.role === 'staff') &&<Menu.Item key="auth-2fa">
                        <Icon type="qrcode" />
                        {t('profile.2fa')}
                    </Menu.Item>}
                </Menu>
            </div>
        </div>
        <div className="content">
            {renderContent()}
            <Footer />
        </div>
    </div>
}

export default UserInfo