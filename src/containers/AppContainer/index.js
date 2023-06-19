import React, {Fragment, useContext, useEffect} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import 'antd/dist/antd.css';
import {LayoutContext} from '../../contexts';
import '../../assets/scss/index.scss';
import {Icon, Spin} from 'antd';
import MainLayout from "../../components/layout/MainLayout";
import {getCookie} from "../../utils/helpers";
import {useSelector} from "react-redux";
import {io} from 'socket.io-client';
import Axios from "axios";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
let socket = null
let debounce = null

export default function AppContainer() {
    const {loading} = useContext(LayoutContext);

    const user = useSelector(el => el.user)

    useEffect(() => {
        if (user) {
            socket = io("/", {
                extraHeaders: {
                    Authorization: getCookie('access_token'),
                    ['X-CSRF-Token']: getCookie('refresh_token')
                }
            })
            socket.on("connect_error", async (err) => {
                console.log(err)
                clearTimeout(debounce)
                // reconnect
                debounce = setTimeout(() => {
                    resetToken(() => {
                        const newToken = getCookie('access_token')
                        console.log('newToken', newToken);
                        socket = io("/", {
                            extraHeaders: {
                                Authorization: getCookie('access_token'),
                                ['X-CSRF-Token']: getCookie('refresh_token')
                            }
                        })
                        socket.connect()
                    })
                }, 1000)
            })
            socket.on('connect', () => {
                console.log('connect to socket io');
                if (socket.connected) {
                    socket.on("welcome", data => {
                        console.log(data.message)
                    })
                }
            })
        }
    }, [user, getCookie('access_token')])

    const resetToken = (refreshSuccess) => {
        Axios('/api/users/client/reset-token', {
            method: 'patch',
            withCredentials: true
        })
            .then(() => {
                refreshSuccess()
            })
            .catch(err => {
                console.log('refresh token err: ', err.response);
            })
    }
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