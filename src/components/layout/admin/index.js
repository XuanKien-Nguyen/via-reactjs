import SideBarLayout from "./SideBarLayout";
import {Layout} from "antd";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import React, {useContext} from "react";
import {LayoutContext} from "../../../contexts";
import '../../../assets/scss/admin.scss'
import BreadCrumb from "../../pages/common/breadcrumb/BreadCrumb";
import {useHistory} from "react-router-dom";

const {Content} = Layout;

const LayoutAdmin = ({children}) => {

    const history = useHistory()

    const {sideBarCollapsed} = useContext(LayoutContext);

    return <Layout style={{marginLeft: sideBarCollapsed ? '80px' : '250px'}} id="layout_admin">
        <SideBarLayout/>
        <Layout>
            <HeaderLayout/>
            <Content>
                <div style={{marginBottom: '20px'}}>
                    <BreadCrumb history={history} layoutAdmin={true} />
                </div>
                {children}
            </Content>
            <FooterLayout/>
        </Layout>
    </Layout>
}

export default LayoutAdmin