import SideBarLayout from "./SideBarLayout";
import {Layout} from "antd";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import React, {useContext} from "react";
import {LayoutContext} from "../../../contexts";
import '../../../assets/scss/admin.scss'

const {Content} = Layout;

const LayoutAdmin = ({children}) => {

    const {sideBarCollapsed} = useContext(LayoutContext);

    return <Layout style={{marginLeft: sideBarCollapsed ? '80px' : '200px'}}>
        <SideBarLayout/>
        <Layout>
            <HeaderLayout/>
            <Content>
                {children}
            </Content>
            <FooterLayout/>
        </Layout>
    </Layout>
}

export default LayoutAdmin