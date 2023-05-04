import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import * as serviceWorker from './serviceWorker';
import './assets/font/font.css'
import './assets/css/common.css'
import i18n from './translation/i18n';
import { I18nextProvider } from 'react-i18next';

ReactDOM.render(<I18nextProvider i18n={i18n}>
    <App />
</I18nextProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
