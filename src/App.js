import React from 'react';
import AppContainer from './containers/AppContainer';

import { LayoutProvider } from '../src/contexts';
import { Provider } from 'react-redux'
import { setAuthorizationToken } from './services/API';
import store from './store'

function App() {
  const authToken = store.get('authenticationToken');
    if (!!authToken) {
    setAuthorizationToken(authToken);
  }

  return (
    <LayoutProvider>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </LayoutProvider>
  );
}

export default App;
