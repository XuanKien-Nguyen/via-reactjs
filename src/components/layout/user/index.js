import {Layout} from "antd";
import HeaderLayoutUser from "./HeaderLayout";
import {useHistory} from "react-router-dom";
import FooterLayoutUser from "./FooterLayout";
import React, {useEffect, useState} from "react";
import {getCategoryList} from "../../../services/category/category";

const {Content} = Layout;

const LayoutUser = ({children}) => {

    const [categoryList, setCategoryList] = useState([]);

    const history = useHistory()

    useEffect(() => {
        getCategoryList().then(res => {
            if (res.status === 200 && res.data) {
                setCategoryList(res.data.categoryListFound);
            }
        });
    }, []);

    return <Layout>
        <Layout>
            <HeaderLayoutUser history={history} categoryList={categoryList}/>
            <Content style={{padding: '0', margin: '0'}}>
                {children}
            </Content>
            <FooterLayoutUser/>
        </Layout>
    </Layout>
}

export default LayoutUser