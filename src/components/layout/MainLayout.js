import React, {Fragment, useEffect, useState} from 'react';
import {dashboardRoutes} from '../../router';
import {getUserInfo} from "../../services/user";

import {useDispatch, useSelector} from "react-redux";
import {Route} from "react-router-dom";

function MainLayout() {

    const dispatch = useDispatch()

    const user = useSelector(store => store.user)

    const [routes, setRoutes] = useState([])

    useEffect(() => {
        if (!user) {
            getUserInfo().then(resp => {
                if (resp.status === 200) {
                    dispatch({type: "SET_USER_INFO", payload: resp?.data?.userFound})
                }
            })
        }
    }, [])

    useEffect(() => {
        // if (user?.role !== 'admin') {
        //     const result = dashboardRoutes.filter(el => el.layout !== 'admin');
        //     setRoutes(result)
        // }else {
        console.log('dashboardRoutes', dashboardRoutes);
        setRoutes(dashboardRoutes)
        // }
    }, [user])

    const renderLayout = (Layout, Component) => {
        return <Layout><Component /></Layout>
    }

    return <Fragment>{routes.map((el, idx) => <Route render={() => renderLayout(el.layout, el.component)} path={el.path} exact={el.exact} />)}</Fragment>
}

export default MainLayout;
