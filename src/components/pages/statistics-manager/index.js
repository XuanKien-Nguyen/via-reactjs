import React, { useContext, useState, useEffect, Fragment } from "react";
import Overview from './components/OverviewComponent';
import { LayoutContext } from "../../../contexts";
import { useSelector } from "react-redux";
import { convertCurrencyVN } from "../../../utils/helpers";
import {Button, Icon, Tooltip, Tag, message, Modal, DatePicker, Card, Col, Row, Typography} from "antd";
import { useTranslation } from "react-i18next";
import {getAllStatistics} from '../../../services/statistics-manager';
import "./index.scss";

export default () => {

    const { t } = useTranslation()
    const user = useSelector(store => store.user)
    const { setLoading } = useContext(LayoutContext)

    const [ds, setDs] = useState(null)

    useEffect(() => {
        getAllStatistics().then(resp => {
            if (resp.status === 200) {
                console.log(resp.data);
                setDs(resp?.data || {});
            }
        }).catch(err => message.error(err?.data?.message))
    }, [])

    return <div>
        {user && <Fragment>
            <Overview items={ds}/>
        </Fragment>}
    </div>
}