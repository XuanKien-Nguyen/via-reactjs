import React, {Fragment, useContext} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import {Spin} from 'antd';
import 'antd/dist/antd.css';

import {LayoutContext} from '../../contexts';

import '../../assets/scss/index.scss';

import MainLayout from "../../components/layout/MainLayout";

export default function AppContainer() {
    const {loading} = useContext(LayoutContext);
    return (
        <Fragment>
            <Spin spinning={loading}>
                <Router>
                    <Switch>
                        <MainLayout/>
                    </Switch>
                </Router>
            </Spin>
        </Fragment>
    );
}