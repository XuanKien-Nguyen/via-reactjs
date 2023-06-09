import React, { useContext, useState, useEffect, Fragment } from "react";
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import {Button, Icon, Tooltip, Tag, message, Modal, DatePicker} from "antd";
import { useTranslation } from "react-i18next";

export default () => {

    const { t } = useTranslation()
    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)

    const renderMoney = (el, prefix = '+') => {
        if (el && (el + '').startsWith('-')) {
            return <b style={{color: 'red'}}>{convertCurrencyVN(el)}</b>
        } else if (el === 0) {
            return <b>0 VND</b>
        }
        return <b style={{color: 'green'}}>{`${prefix}${convertCurrencyVN(el)}`}</b>
    }


    return <div>
        {user && <Fragment>
            STATISTICS PAGE
        </Fragment>}
    </div>
}