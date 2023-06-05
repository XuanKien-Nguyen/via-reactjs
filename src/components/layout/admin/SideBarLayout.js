import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {withRouter} from 'react-router';
import {Icon, Layout, Menu} from 'antd';
import pathToRegexp from 'path-to-regexp';

import {dashboardRoutes} from '../../../router';
import {LayoutContext} from '../../../contexts';

const {Sider} = Layout;


function SideBarLayout(props) {
    const {
        location: {pathname}
    } = props;

    const history = useHistory()

    const isPathMatchRequestedUrl = path => !!pathToRegexp(path).exec(pathname);
    const {
        sideBarCollapsed,
        setCollapsed,
        theme,
    } = useContext(LayoutContext);

    return (
        <Sider
            width={'250px'}
            collapsible
            collapsed={sideBarCollapsed}
            onCollapse={() => setCollapsed(!sideBarCollapsed)}
            id='sidebar_admin'
        >
            <div className="logo" onClick={() => window.location.href = '/'} style={{cursor: 'pointer'}}>
                <img src={require('../../../assets/img/favicon.png')} alt=""/>
                {!sideBarCollapsed && <span>VIA2FA</span>}
            </div>
            <Menu
                theme={theme}
                mode="inline"
                activeKey={pathname}
                selectedKeys={[pathname]}
            >
                {dashboardRoutes.map(({path, showAlways, icon, name}) => (
                    <Menu.Item key={isPathMatchRequestedUrl(path) ? pathname : path}>
                        {(showAlways || isPathMatchRequestedUrl(path)) && (
                            <Link to={path}>
                                <Icon type={icon}/>
                                <span className="nav-text">{name}</span>
                            </Link>
                        )}
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>
    );
}

export default withRouter(SideBarLayout);
