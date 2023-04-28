import React, {useContext, useEffect, useState} from "react";
import UserDetail from "./components/UserDetail";
import ChangePassword from "./components/ChangePassword";
import Enable2Fa from "./components/Enable2Fa";
import PurchaseList from './components/PurchaseList'
import '../../../assets/scss/user-info.scss'
import {useSelector} from "react-redux";
import {Icon, Menu, Tag} from 'antd';
import {LayoutContext} from "../../../contexts";

const UserInfo = () => {

    const {setLoading} = useContext(LayoutContext)

    const user = useSelector(store => store.user)

    const [current, setCurrent] = useState("purchase")

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [current])

    const renderContent = () => {
        if (current === "c-pwd") {
            return <ChangePassword user={user} />
        } else if (current === "auth-2fa" && (user?.role === 'admin' || user?.role === 'staff')) {
            return <Enable2Fa loading={setLoading} />
        } else if (current === 'purchase') {
            return <PurchaseList loading={setLoading}/>
        }
        return <UserDetail user={user} />
    }

    const changeMenu = e => {
        setCurrent(e.key)
    }

    return <div id='user_id' className='header-main_container p-t-30'>
        <div className="sidebar">
            <div className="avatar">
                <img src={require('../../../assets/img/avatar.png')} alt="" className="src"/>
                <p>{`@${user?.username}`}<i className="id_text">{`#${user?.id}`}</i></p>
                <Tag color={user?.role === 'admin' ? 'red' : 'blue'}>{user?.role}</Tag>
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
                        THÔNG TIN CÁ NHÂN
                    </Menu.Item>
                    <Menu.Item key="purchase">
                        <Icon type="shop" />
                        ĐƠN HÀNG
                    </Menu.Item>
                    <Menu.Item key="c-pwd">
                        <Icon type="lock" />
                        ĐỔI MẬT KHẨU
                    </Menu.Item>
                    { (user?.role === 'admin' || user?.role === 'staff') &&<Menu.Item key="auth-2fa">
                        <Icon type="qrcode" />
                        BẬT XÁC THỰC 2FA
                    </Menu.Item>}
                </Menu>
            </div>
        </div>
        <div className="content">
            {renderContent()}
        </div>

    </div>
}

export default UserInfo