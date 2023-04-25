import React, {Fragment, useContext} from 'react';
import {BrowserRouter as Router, Switch, Redirect, Route} from 'react-router-dom';
import {Spin} from 'antd';
import 'antd/dist/antd.css';

import {LayoutContext} from '../../contexts';

import '../../assets/scss/index.scss';

import MainLayout from "../../components/layout/MainLayout";
import NotFound from "../../components/pages/404/404";

export default function AppContainer() {
    const {loading, error, successNotification} = useContext(LayoutContext);

    return (
        <Fragment>
            <Spin spinning={loading}>
                <Router>
                    <Switch>
                        <MainLayout/>
                    </Switch>
                    <Redirect path="*" to={'/404'} />
                </Router>
            </Spin>
        </Fragment>
    );
}