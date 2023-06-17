import React from "react";
import './index.scss'

import { useTranslation } from 'react-i18next';

const AccessDenied = () => {

    const { t } = useTranslation()

    return <div id='maintenance'>
        <h1>503</h1>
        <h2>Oops!</h2>
        <p>{t('maintenance.title')}</p>
        <p>{t('maintenance.content')}</p>
    </div>
}

export default AccessDenied