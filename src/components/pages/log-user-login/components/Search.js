import {Button, Collapse, Icon} from "antd";
import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
const { Panel } = Collapse
let debounce = null
export default ({items, onReset, search, loading, setPage, page, state = [], reload}) => {

    const {api, resolve, reject} = search

    const [init, setInit] = useState(0)

    const { t } = useTranslation()

    useEffect(() => {
        getList()
    }, [])

    useEffect(() => {
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            if (init > 0) {
                getList()
            }
        }, 300)
        setInit(init + 1)
    }, [...state])

    useEffect(() => {
        getList()
    }, [reload])

    const getList = () => {
        loading(true)
        api().then(resp => {
            resolve(resp, setPage)
        }).catch(err => reject(err))
            .finally(() => loading(false))
    }

    return <div className="filter-order-admin">
        <div className='filter' style={{padding: '0px'}}>
            <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled"/>&nbsp;{t('filter.title')}</div>
                </div>}>
                    {items}
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                    onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}