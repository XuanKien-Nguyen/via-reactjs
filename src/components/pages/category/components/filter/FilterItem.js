import React from 'react';
import {Input, Select} from 'antd';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const { Option } = Select;
const FilterItem = ({id, title, options, setValue, defaultValue, type = 'select', width = 300, placeholder}) => {

    const onChange = (value) => {
        setValue(value)
    }

    const onChangeNumberText = e => setValue(e.target.value)

    function onChangeDate(date, dateString) {
        setValue(dateString)
    }

    const renderType = () => {
        if (type === 'number' || type === 'text') {

            return <Input type={type} placeholder={title} onChange={onChangeNumberText} defaultValue={defaultValue} style={{ width }} />
        } else if (type === 'date') {
            return <RangePicker onChange={onChangeDate} placeholder={placeholder || title} defaultValue={defaultValue} style={{ width }} />
        } else {
            return <Select
                showSearch
                style={{ width: 300 }}
                placeholder={placeholder || title}
                defaultValue={defaultValue}
                optionFilterProp="children"
                onChange={onChange}
                value={defaultValue}
            >
                {options.map((el, idx) => <Option key={idx} value={el.value}>{el.label}</Option>)}
            </Select>
        }
    }

    return (
        <div className={`filter-${id} filter-item`}>
            <span>{title}</span>
            {renderType()}
        </div>
    );
};
export default FilterItem;