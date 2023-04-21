import React, { useContext, Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Spin, notification } from 'antd';
import 'antd/dist/antd.css';
import store from 'index';

import { LayoutContext } from '../../contexts';
import { handleRequestError } from '../../services/API';
import { baseRoutes } from '../../router';
import { URL_BASE_NAME } from '../../utils/constants';

import '../../assets/scss/index.scss';

export default function AppContainer({ history }) {

  console.log(history);

  const { loading, error, successNotification } = useContext(LayoutContext);

  return (
    <Fragment>
      <Spin spinning={loading}>
        <Router history={history} basename={URL_BASE_NAME}>
          <Switch>
            {baseRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
          {/*{!authToken && <Redirect to="/login" />}*/}
        </Router>
      </Spin>
    </Fragment>
  );
}