import React from 'react';
import AppContainer from './containers/AppContainer';

import { LayoutProvider } from '../src/contexts';
import { Provider } from 'react-redux'
import store from './store'

function App() {

  return (
    <LayoutProvider>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </LayoutProvider>
  );
}

export default App;
