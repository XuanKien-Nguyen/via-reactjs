import React, { useState, useEffect, useRef } from 'react';
import { Cascader } from 'antd';

const FilterItem = ({filterType, filterTitle, filterList, resetValue}) => {

    const inputRef = useRef(null); 

    const filterCategory = (inputValue, path) => {
        return path.some(filterList => filterList.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    const onChangeFilter = (value, selectedOptions) => {
        console.log('onchange',value);
    }

    const resetfilterValue = () => {
        
    }

    useEffect(() => {
        resetValue.current = resetfilterValue
    }, []);

    return (
        <div className={`filter-${filterType} filter-item`}>
            <span>{filterTitle}</span>
            <Cascader className={`filter-${filterType}-box`} ref={inputRef} options={filterList} onChange={onChangeFilter} showSearch={{ filterCategory }} value={filterList}/>
        </div>
    );
};
export default FilterItem;
