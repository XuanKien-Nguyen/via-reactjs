import React from "react";
import './style.scss'

import { useTranslation } from 'react-i18next';

const AccessDenied = () => {

    const { t } = useTranslation()

    return <div id='not_found'>
        <h1>403</h1>
        <h2>Oops!</h2>
        <p>{t('access-denied.title')}</p>
        <p>{t('access-denied.content')}</p>
    </div>
}

export default AccessDenied