import React, {Fragment, useContext} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';
import {LayoutContext} from '../../contexts';
import '../../assets/scss/index.scss';
import {Spin, Icon} from 'antd';
import MainLayout from "../../components/layout/MainLayout";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


export default function AppContainer() {
    const {loading} = useContext(LayoutContext);
    return (
        <Fragment>
            <Spin spinning={loading} indicator={antIcon}>
                <Router>
                    <Switch>
                        <MainLayout/>
                    </Switch>
                </Router>
            </Spin>
        </Fragment>
    );
}