import React, { useState, useContext } from 'react';
import { Layout, Icon, Modal } from 'antd';

import { LayoutContext } from '../../../contexts';
import {logout} from "../../../services/user";
import {useDispatch} from "react-redux";

const { Header } = Layout;

function HeaderLayout() {
  const { headerComponent } = useContext(LayoutContext);

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const {setLoading} = useContext(LayoutContext);

    const dispatch = useDispatch()

    const handleLogout = async () => {
        setLoading(true)
        await logout();
        dispatch({type: "LOGOUT"})
        localStorage.removeItem("is_logged")
        localStorage.removeItem('user_info')
        window.location.href = '/'
        setLoading(false)
    }

  return (
    <Header>
      {/*<div className="header-wrapper">*/}
      {/*  <div className="page-header">{headerComponent}</div>*/}
      {/*  <Icon type="logout" onClick={() => setLogoutModalOpen(true)} className="logout-icon" />  */}
      {/*</div>*/}
      {/*<Modal*/}
      {/*  title="Đăng xuất"*/}
      {/*  visible={isLogoutModalOpen}*/}
      {/*  onOk={handleLogout}*/}
      {/*  onCancel={() => setLogoutModalOpen(false)}*/}
      {/*>*/}
      {/*  Bạn có thực sự muốn thoát?*/}
      {/*</Modal>*/}
    </Header>
  );
}

export default HeaderLayout;
