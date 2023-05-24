import React from 'react';
import {DatePicker, Input, Select} from 'antd';

const {RangePicker} = DatePicker;

const {Option, OptGroup} = Select;
const FilterItem = (props) => {

    const {id, title, options, setValue, defaultValue, type = 'select', width = '100%', placeholder} = props

    const onChange = (value) => {
        setValue(value)
    }

    const onChangeNumberText = e => setValue(e.target.value)

    function onChangeDate(date, dateString) {
        setValue(date)
    }

    const renderType = () => {
        if (type === 'number' || type === 'text') {

            return <Input type={type}
                          value={defaultValue}
                          placeholder={title}
                          onChange={onChangeNumberText}
                          defaultValue={defaultValue}
                          style={{width}}
                          {...props} />
        } else if (type === 'date') {
            return <RangePicker onChange={onChangeDate}
                                placeholder={placeholder || title}
                                defaultValue={defaultValue}
                                value={defaultValue}
                                style={{width}}
                                {...props} />
        } else if (type === 'select-group') {
            return <Select placeholder={title} onChange={onChange} {...props}>
                {
                    options.map(e => <OptGroup label={e.label}>
                            {e.options.map(c => <Option value={c.value}>{c.label}</Option>)}
                        </OptGroup>
                    )
                }
            </Select>
        } else {
            return <Select
                showSearch
                style={{width}}
                placeholder={placeholder || title}
                defaultValue={defaultValue}
                optionFilterProp="children"
                onChange={onChange}
                value={defaultValue}
                {...props}
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