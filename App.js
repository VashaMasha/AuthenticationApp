
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store/configureStore';
import { PersistGate } from 'redux-persist/integration/react'
import RootNavigator from './components/RootNavigator';

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <RootNavigator />
                </PersistGate>
              </Provider>
          );
      }
}