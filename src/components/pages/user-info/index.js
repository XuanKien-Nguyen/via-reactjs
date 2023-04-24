import React, {useState} from "react";
import UserDetail from "./components/UserDetail";
import ChangePassword from "./components/ChangePassword";
import Enable2Fa from "./components/Enable2Fa";
import '../../../assets/scss/user-info.scss'
import {useSelector} from "react-redux";
import {Icon, Menu} from 'antd';

const {SubMenu} = Menu;

const UserInfo = () => {

    const user = useSelector(store => store.user)

    const [current, setCurrent] = useState("1")

    const renderContent = () => {
        if (current === "2") {
            return <ChangePassword />
        } else if (current === "3") {
            return <Enable2Fa />
        }
        return <UserDetail />
    }

    const changeMenu = e => {
        setCurrent(e.key)
        console.log(e);
    }


    return <div id='user_id' className='header-main_container p-t-30'>
        <div className="sidebar">
            <div className="avatar">
                <img src={require('../../../assets/img/avatar.png')} alt="" className="src"/>
                <p>{`@${user.username}`}<i className="id_text">{`#${user.id}`}</i></p>
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
                    <Menu.Item key="1">
                        <Icon type="solution" />
                        THÔNG TIN CÁ NHÂN
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="lock" />
                        ĐỔI MẬT KHẨU
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="qrcode" />
                        BẬT XẮC THỰC 2FA
                    </Menu.Item>
                </Menu>
            </div>
        </div>
        <div className="content">
            {renderContent()}
        </div>

    </div>
}

export default UserInfo