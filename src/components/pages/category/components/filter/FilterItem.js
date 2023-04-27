import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
const FilterItem = ({id, title, options, setValue, defaultValue}) => {

    const onChange = (value) => {
        setValue(value)
    }

    return (
        <div className={`filter-${id} filter-item`}>
            <span>{title}</span>
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder={title}
                defaultValue={defaultValue}
                optionFilterProp="children"
                onChange={onChange}
                value={defaultValue}
            >
                {options.map((el, idx) => <Option key={idx} value={el.value}>{el.label}</Option>)}
            </Select>
        </div>
    );
};
export default FilterItem;