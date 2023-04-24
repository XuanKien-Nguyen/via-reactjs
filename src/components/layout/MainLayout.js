import React, {Fragment, useEffect, useState} from 'react';
import {baseRoutes, dashboardRoutes} from '../../router';
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
                    const userFound = resp?.data?.userFound || null
                    dispatch({type: "SET_USER_INFO", payload: userFound})
                }
            })
        }
    }, [])

    useEffect(() => {
        const lstRoutes = [...dashboardRoutes.filter(el => el.role.some(r => r === user?.role)), ...baseRoutes]
        setRoutes(lstRoutes)
    }, [user])

    const renderLayout = (Layout, Component) => {
        return <Layout><Component/></Layout>
    }

    return <Fragment>{routes.map((el, idx) => <Route key={idx} render={() => renderLayout(el.layout, el.component)}
                                                     path={el.path}
                                                     exact={el.exact}/>)}</Fragment>
}

export default MainLayout;
