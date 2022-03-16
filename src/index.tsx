// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from 'serviceWorker';

import { Provider } from 'react-redux';
import { store, persistor } from 'redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Amplify from 'aws-amplify';

import App from './App';
import config from './aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure({...config, API: {
  endpoints: [
    {
      name: "receipt",
      endpoint: process.env.REACT_APP_END_POINT,
      region: "ap-northeast-1"
    },
  ]
}});


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
