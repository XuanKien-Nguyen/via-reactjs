import {Layout} from "antd";
import HeaderLayoutUser from "./HeaderLayout";
import {useHistory} from "react-router-dom";
import FooterLayoutUser from "./FooterLayout";
import React from "react";

const {Content} = Layout;

const LayoutUser = ({children}) => {


    const history = useHistory()

    return <Layout>
        <Layout>
            <HeaderLayoutUser history={history}/>
            <Content style={{padding: '0', margin: '0'}}>
                {children}
            </Content>
            <FooterLayoutUser/>
        </Layout>
    </Layout>
}

export default LayoutUser