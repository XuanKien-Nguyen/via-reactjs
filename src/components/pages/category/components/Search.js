import { Button, Collapse, Icon, message } from "antd";
import FilterItem from "./filter/FilterItem";
import React, { useEffect, useState, useContext } from "react";
import { LayoutContext } from "../../../../contexts";
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { getCategoryList } from '../../../../services/category/category';
const { Panel } = Collapse

const DEFAULT_VALUE = {
    parentCategory: '',
    stock: 'stock',
    locationStocking: '',
    name: ''
}

let debounce = null

export default ({ setResultSearch, parentId, getParentCategory, getTypeStockList, getLocationStockingList }) => {

    const { t } = useTranslation()

    const history = useHistory()

    const query = new URLSearchParams(window.location.search);
    const searchValue = query.get('name')

    const { setLoading } = useContext(LayoutContext)

    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState()
    const [locationStocking, setLocationStocking] = useState()
    const [stock, setStock] = useState()

    const onReset = () => {  
        setParentCategory(DEFAULT_VALUE.parentCategory)
        setStock(DEFAULT_VALUE.stock)
        setLocationStocking(DEFAULT_VALUE.locationStocking)
        setName(DEFAULT_VALUE.name)
    }

    useEffect(() => {
        setParentCategory(DEFAULT_VALUE.parentCategory)
        setStock(DEFAULT_VALUE.stock)
        setLocationStocking(DEFAULT_VALUE.locationStocking)
        if (!searchValue) {
            setName(DEFAULT_VALUE.name)
        } else {
            setName(searchValue)
        }
    }, [])

    useEffect(() => {
        if (parentId) {
            setParentCategory(Number.parseInt(parentId))
        }
        if (searchValue) {
            setName(searchValue)
            setParentCategory(DEFAULT_VALUE.parentCategory)
            setStock(DEFAULT_VALUE.stock)
            setLocationStocking(DEFAULT_VALUE.locationStocking)
        }
    }, [parentId, searchValue])

    useEffect(() => {
        history.push({search: `?id=${parentCategory}&type=${stock}&location=${locationStocking}&name=${name}`})
        setLoading(true)
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            getCategoryList({
                parent_id: parentCategory || null,
                type: stock || null,
                location: locationStocking,
                name
            }).then(resp => {
                if (resp.status === 200) {
                    setResultSearch(resp.data?.categoryListFound || [])
                }
                setLoading(false)
            })
        }, 500)
    }, [parentCategory, stock, locationStocking, name])

    return <div className='filter-product'>
        <div className='filter' style={{ padding: '0px' }}>
            <Collapse className='filter-layout' accordion style={{ backgroundColor: '#e9e9e9' }} defaultActiveKey={1}>
                <Panel key={1} className='filter-container' header={<div className='filter-header'>
                    <div><Icon type="filter" theme="filled" />&nbsp;{t('filter.title')}</div>
                </div>}>
                    <FilterItem defaultValue={parentCategory} setValue={setParentCategory} options={getParentCategory()}
                        type={'select'} title={t('filter.category')} />
                    <FilterItem defaultValue={locationStocking} setValue={setLocationStocking} options={getLocationStockingList()}
                        type={'select'} title={t('filter.location')} />
                    <FilterItem defaultValue={stock} setValue={setStock} options={getTypeStockList()}
                        type={'select'} title={t('filter.stock')} />
                </Panel>
            </Collapse>
            <Button className='reset-filter-btn' type="primary" size='small' icon="reload"
                onClick={onReset}>{t('common.reset')}</Button>
        </div>
    </div>
}