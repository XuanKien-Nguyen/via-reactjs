import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'antd';

import SideBarLayout from './admin/SideBarLayout';
import HeaderLayout from './admin/HeaderLayout';
import FooterLayout from './admin/FooterLayout';

import SideBarLayoutUser from './user/SideBarLayout';
import HeaderLayoutUser from './user/HeaderLayout';
import FooterLayoutUser from './user/FooterLayout';

import { dashboardRoutes } from '../../router';
import { LayoutContext } from '../../contexts';

import { getCategoryList } from '../../services/category';
import { useState, useEffect } from 'react';

const { Content } = Layout;

function MainLayout() {
  const { sideBarCollapsed } = useContext(LayoutContext);

  const isAdmin = localStorage.getItem('role');

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList().then(res => {
      if(res.status === 200 && res.data) {
        setCategoryList(res.data.categoryListFound);
      }
    });
  }, []);

  return (
    isAdmin === 'admin' ? <Layout style={{ marginLeft: sideBarCollapsed ? '80px' : '200px' }}>
      <SideBarLayout />
      <Layout>
        <HeaderLayout />
        <Content>
          <Switch>
            {dashboardRoutes.filter(el => el.layout === 'admin').map(route => (
              <Route
                exact={true}
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
            <Redirect to="/" />
          </Switch>
        </Content>
        <FooterLayout />
      </Layout>
    </Layout> : <Layout>
        {/* <SideBarLayoutUser /> */}
        <Layout>
            <HeaderLayoutUser categoryList={categoryList}/>
            <Content style={{padding: '0', margin: '0'}}>
                <Switch>
                    {dashboardRoutes.filter(el => el.layout !== 'admin').map(route => (
                        <Route
                            exact={true}
                            key={route.path}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                    <Redirect to="/" />
                </Switch>
            </Content>
            <FooterLayoutUser  />
        </Layout>
    </Layout>
  );
}

export default MainLayout;
