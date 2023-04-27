import React, {useContext, useState} from "react";
import UserDetail from "./components/UserDetail";
import ChangePassword from "./components/ChangePassword";
import Enable2Fa from "./components/Enable2Fa";
import '../../../assets/scss/user-info.scss'
import {useSelector} from "react-redux";
import {Icon, Menu, Tag} from 'antd';
import {LayoutContext} from "../../../contexts";

const UserInfo = () => {

    const {setLoading} = useContext(LayoutContext)

    const user = useSelector(store => store.user)

    const [current, setCurrent] = useState("1")

    const renderContent = () => {
        if (current === "2") {
            return <ChangePassword user={user} />
        } else if (current === "3" && (user?.role === 'admin' || user?.role === 'staff')) {
            return <Enable2Fa loading={setLoading} />
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
                    <Menu.Item key="1">
                        <Icon type="solution" />
                        THÔNG TIN CÁ NHÂN
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="lock" />
                        ĐỔI MẬT KHẨU
                    </Menu.Item>
                    { (user?.role === 'admin' || user?.role === 'staff') &&<Menu.Item key="3">
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