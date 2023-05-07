import React, {Fragment, useContext, useEffect, useState} from 'react';
import {baseRoutes, dashboardRoutes} from '../../router';
import {getUserInfo} from "../../services/user";

import {useDispatch, useSelector} from "react-redux";
import {Route, useLocation, useHistory} from "react-router-dom";
import {LayoutContext} from "../../contexts";

let accessRoutes = [...dashboardRoutes, ...baseRoutes]

function MainLayout() {

    const {setLoading} = useContext(LayoutContext);

    const history = useHistory()

    const location = useLocation()

    const dispatch = useDispatch()

    const user = useSelector(store => store.user)

    const [routes] = useState([...dashboardRoutes, ...baseRoutes])

    const [forceRender, setForceRender] = useState(0)

    const isLogged = localStorage.getItem("is_logged")


    useEffect(() => {
        if (!user && isLogged === 'true') {
            setLoading(true)
            getUserInfo().then(resp => {
                if (resp.status === 200) {
                    const userFound = resp?.data?.userFound || null
                    dispatch({type: "SET_USER_INFO", payload: userFound})
                    localStorage.setItem('user_info', JSON.stringify(userFound))
                    accessRoutes = [...dashboardRoutes.filter(el => el.role.some(r => r === userFound?.role)), ...baseRoutes]
                    setForceRender(forceRender + 1)
                }
            }).catch(err => {
                console.log('MainLayout', err);
                accessRoutes = baseRoutes
                setForceRender(forceRender + 1)
                localStorage.removeItem('user_info')
                localStorage.removeItem('is_logged')
                dispatch({type: "LOGOUT"})
            }).finally(() => setLoading(false));
        } else {
            accessRoutes = baseRoutes
        }
    }, [])

    useEffect(() => {
        const {pathname} = location

        if (!routes.some(el => el.path === pathname)) {
            history.push('/not-found')
            return
        }
        const isAccess = accessRoutes.some(el => el.path === pathname.split('?')[0])
        if (!isAccess && window.location.href !== pathname) {
            history.push('/access-denied')
            return
        }
        const currentRoute = routes.find(el => el.path === pathname)
        document.title = `${currentRoute.name}`
    }, [location, forceRender])


    const renderLayout = (Layout, Component) => {
        return <Layout><Component/></Layout>
    }

    return <Fragment>{routes.map((el, idx) => <Route key={idx} render={() => renderLayout(el.layout, el.component)}
                                                     path={el.path}
                                                     exact={el.exact}/>)}</Fragment>
}

export default MainLayout;
