import React, {Fragment, useContext} from 'react';
import {BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import {Spin} from 'antd';
import 'antd/dist/antd.css';

import {LayoutContext} from '../../contexts';

import '../../assets/scss/index.scss';

import MainLayout from "../../components/layout/MainLayout";

export default function AppContainer() {
    const {loading, error, successNotification} = useContext(LayoutContext);

    return (
        <Fragment>
            <Spin spinning={loading}>
                <Router>
                    <Switch>
                        <MainLayout/>
                        <Redirect to="/404"/>
                    </Switch>
                </Router>
            </Spin>
        </Fragment>
    );
}