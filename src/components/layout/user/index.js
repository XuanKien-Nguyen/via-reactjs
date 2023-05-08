import React from "react";
import {Layout} from "antd";
import {useHistory} from "react-router-dom";
import HeaderLayoutUser from "./HeaderLayout";
import FooterLayoutUser from "./FooterLayout";
import BreadCrumbUser from "../../pages/common/breadcrumb/BreadCrumb";


const {Content} = Layout;

const LayoutUser = ({children}) => {


    const history = useHistory()

    return <Layout>
        <Layout>
            <HeaderLayoutUser history={history}/>
            <Content style={{padding: '0', margin: '0'}}>
                {history.location.pathname !== '/' ? <BreadCrumbUser history={history} /> : ''}
                {children}
            </Content>
            <FooterLayoutUser/>
        </Layout>
    </Layout>
}

export default LayoutUser