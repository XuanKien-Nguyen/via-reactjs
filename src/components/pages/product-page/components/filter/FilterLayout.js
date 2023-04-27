import React, {useState, useEffect, useContext} from 'react';
import FilterItem from './FilterItem';
import {LayoutContext} from "../../../../../contexts";
import { getParentCategoryList, getLocationList, getTypeList, getCategoryList } from '../../../../../services/category/category';
import { Collapse, Icon, Button } from 'antd';
const { Panel } = Collapse


const DEFAULT_VALUE = {
    category: '',
    productStatus: 'stock',
    location: ''
}

const SELECT_ALL = {value: '', label: 'Xem tất cả'}

const FilterLayout = ({setResultSearch}) => {

    const {setLoading} = useContext(LayoutContext)

  const [categoryFilterList, setCategoryFilterList] = useState([]);
  const [locationFilterList, setLocationFilterList] = useState([]);
  const [typeFilterList, setTypeFilterList] = useState([]);

  // const [resultSearch, setResultSearch] = useState([])

  const [category, setCategory] = useState()
  const [productStatus, setProductStatus] = useState()
  const [location, setLocation] = useState()

  useEffect(() => {
      const init = async () => {
          const respCategory = await getParentCategoryList();
          if (respCategory.status === 200 && respCategory.data) {
              const list = [SELECT_ALL]
              const parentCategoryList = respCategory.data.parentCategoryList;
              parentCategoryList.map(parentCategory => {
                  const name = parentCategory.name
                  list.push({value: parentCategory.id, label: name})
              })
              setCategoryFilterList(list);
          }

          const respLocation = await getLocationList()
          if (respLocation.status === 200 && respLocation.data) {
              const list = [SELECT_ALL]
              const locationList = respLocation.data.nationalFlagList;
              locationList.map(location => {
                  list.push({value: location.name, label: location.name})
              })
              setLocationFilterList(list);
          }

          const respProductStatus = await getTypeList()
          if (respProductStatus.status === 200 && respProductStatus.data) {
              const list = [SELECT_ALL]
              const typeList = respProductStatus.data.CATEGORY_TYPE_LIST;
              typeList.map(type => {
                  list.push({label: type === 'stock' ? 'Còn hàng' : 'Hết hàng', value: type})
              })
              setTypeFilterList(list);
          }
      }
      setLoading(true)
      init()
      resetValue()
      setLoading(false)
  }, []);

  const resetValue = () => {
      setCategory(DEFAULT_VALUE.category)
      setProductStatus(DEFAULT_VALUE.productStatus)
      setLocation(DEFAULT_VALUE.location)
  }

  useEffect(() => {
      setLoading(true)
      getCategoryList({
          parent_id: category || null,
          type: productStatus || null,
          location
      }).then(resp => {
          if (resp.status === 200) {
              setResultSearch(resp.data?.categoryListFound || [])
          }
      }).finally(() => setLoading(false))
  }, [category, productStatus, location])

  return (
    <div className='filter'>
      <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
            <Panel key={1} className='filter-container' header={<div className='filter-header'><div><Icon type="filter" theme="filled" />&nbsp;Bộ lọc</div></div>}>
              <FilterItem key={1} id={'category'} title={'Chọn danh mục'} options={categoryFilterList} setValue={setCategory} defaultValue={category}/>
              <FilterItem key={2} id={'location'} title={'Chọn quốc gia'} options={locationFilterList} setValue={setLocation} defaultValue={location}/>
              <FilterItem key={3} id={'type'} title={'Còn hàng'} options={typeFilterList} setValue={setProductStatus} defaultValue={productStatus}/>
            </Panel>
          </Collapse>
          <Button className='reset-filter-btn' type="primary" size='small' icon="reload" onClick={resetValue}>Reset</Button>
    </div>
  );
};
export default FilterLayout;
