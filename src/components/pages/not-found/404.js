import React from "react";
import './style.scss'

import { useTranslation } from 'react-i18next';

const NotFound = () => {

    const { t } = useTranslation()

    return <div id='not_found'>
        <h1>404</h1>
        <h2>Oops!</h2>
        <p>{t('not_found.title')}</p>
    </div>
}

export default NotFound