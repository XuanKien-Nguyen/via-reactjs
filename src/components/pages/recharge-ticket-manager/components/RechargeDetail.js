import React, {Fragment, useEffect} from "react";
import RechargePendingDetail from './recharge-pending-manager/components/Detail'
import {getTypeListRechargePending} from "../../../../services/recharge-manager";

const MAP_TYPE = {}
export default ({rechargePendingDetail}) => {
    useEffect(() => {
        getTypeListRechargePending().then(resp => {
            const data = resp.data?.TYPE_OBJ || [];
            for (const key of Object.keys(data)) {
                MAP_TYPE[data[key]] = `recharge-type.${key}`
            }
        })
    }, [])

    return <Fragment>
        <RechargePendingDetail rechargePendingDetail={rechargePendingDetail} mapType={MAP_TYPE}/>
    </Fragment>
}