import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';

import { dashboardRoutes } from '../../../router';
import { LayoutContext } from '../../../contexts';

const { Sider } = Layout;

function SideBarLayout(props) {
  const {
    location: { pathname }
  } = props;

  const isPathMatchRequestedUrl = path => !!pathToRegexp(path).exec(pathname);
  const {
    sideBarCollapsed,
    setCollapsed,
    theme,
  } = useContext(LayoutContext);

  return (
    <p>side bar</p>
  );
}

export default withRouter(SideBarLayout);
