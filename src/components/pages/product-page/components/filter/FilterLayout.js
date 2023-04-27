import React, { useState, useEffect, useRef } from 'react';
import FilterItem from './FilterItem';
import { getParentCategoryList, getLocationList, getTypeList } from '../../../../../services/category/category';
import { Collapse, Icon, Button } from 'antd';
const { Panel } = Collapse

const FilterLayout = () => {

  const [categoryFilterList, setCategoryFilterList] = useState([]);
  const [locationFilterList, setLocationFilterList] = useState([]);
  const [typeFilterList, setTypeFilterList] = useState([]);

  const resetCategory = useRef(null);
  const resetLocation = useRef(null);
  const resetType = useRef(null);

  useEffect(() => {
    getParentCategoryList().then(res => {
        const tmp = [{value: 'Chọn tất cả', label: 'Chọn tất cả'}];
        if (res.status === 200 && res.data) {
          const parentCategoryList = res.data.parentCategoryList;
          parentCategoryList.map(parentCategory => {
            tmp.push({value: parentCategory.name, label: parentCategory.name})
          })
          setCategoryFilterList(tmp);
        }
    });
  }, []);

  useEffect(() => {
    getLocationList().then(res => {
        const tmp = [{value: 'Chọn tất cả', label: 'Chọn tất cả'}];
        if (res.status === 200 && res.data) {
          const locationList = res.data.nationalFlagList;
          locationList.map(location => {
            tmp.push({value: location.name, label: location.name})
          })
          setLocationFilterList(tmp);
        }
    });
  }, []);

  useEffect(() => {
    getTypeList().then(res => {
        const tmp = [{value: 'Xem tất cả', label: 'Xem tất cả'}];
        if (res.status === 200 && res.data) {
          const typeList = res.data.CATEGORY_TYPE_LIST;
          typeList.map(type => {
            tmp.push({value: type === 'stock' ? 'Còn hàng' : 'Hết hàng', label: type === 'stock' ? 'Còn hàng' : 'Hết hàng'})
          })
          setTypeFilterList(tmp);
        }
    });
  }, []);

  const resetFilter = () => {
    resetCategory.current();
    // resetLocation.current();
    // resetType.current();
  }

  return (
    <div className='filter'>
      <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}}>
            <Panel className='filter-container' header={<div className='filter-header'><div><Icon type="filter" theme="filled" />&nbsp;Bộ lọc</div></div>}>
              <FilterItem filterType={'category'} filterTitle={'Chọn danh mục'}  filterList={categoryFilterList} resetValue={resetCategory}/>
              {/* <FilterItem filterType={'location'} filterTitle={'Chọn quốc gia'} defaultValue={['Chọn tất cả']} filterList={locationFilterList} resetValue={resetLocation}/>
              <FilterItem filterType={'type'} filterTitle={'Còn hàng'} defaultValue={['Còn hàng']} filterList={typeFilterList} resetValue={resetType}/> */}
            </Panel>
          </Collapse>
          <Button className='reset-filter-btn' type="primary" size='small' icon="reload" onClick={resetFilter}>Reset</Button>
    </div>
  );
};
export default FilterLayout;
