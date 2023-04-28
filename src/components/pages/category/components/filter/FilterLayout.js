import React, {useState, useEffect, useContext} from 'react';
import FilterItem from './FilterItem';
import {LayoutContext} from "../../../../../contexts";
import { getParentCategoryList, getLocationList, getTypeList, getCategoryList, getLocationListStocking } from '../../../../../services/category/category';
import { Collapse, Icon, Button } from 'antd';
import {useDispatch, useSelector} from "react-redux";
const { Panel } = Collapse


const DEFAULT_VALUE = {
    category: '',
    productStatus: 'stock',
    location: ''
}

const SELECT_ALL = {value: '', label: 'Xem tất cả'}

let debounce = null

const FilterLayout = ({setResultSearch, parentId}) => {

    const categories = useSelector(store => store.categories)

    const dispatch = useDispatch()

    const {setLoading} = useContext(LayoutContext)

  const [locationFilterList, setLocationFilterList] = useState([]);
  const [typeFilterList, setTypeFilterList] = useState([]);

  const [category, setCategory] = useState()
  const [productStatus, setProductStatus] = useState()
  const [location, setLocation] = useState()

  useEffect(() => {
      setLoading(true)
      const init = async () => {
          if (!categories.called) {
              const respCategory = await getParentCategoryList();
              if (respCategory.status === 200 && respCategory.data) {
                  const list = []
                  const parentCategoryList = respCategory.data.parentCategoryList;
                  parentCategoryList.map(parentCategory => {
                      const name = parentCategory.name
                      list.push({value: parentCategory.id, label: name})
                  })
                  dispatch({type: 'SET_CATEGORIES', payload: list});
              }
          }

          const respLocation = await getLocationListStocking()
          if (respLocation.status === 200 && respLocation.data) {
              const list = [SELECT_ALL]
              const locationList = respLocation.data.nationalFlagList;
              locationList.map(location => {
                  list.push({value: location.name, label: <div style={{display: 'flex', alignItems: 'center'}}><img style={{width: '20px', marginRight: '8px'}} src={location.path} alt="" className="src"/>{location.name}</div>})
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
      init()
      resetValue()
  }, []);

  useEffect(() => {
      if (parentId) {
          setCategory(Number.parseInt(parentId))
      }
  }, [parentId])

  const resetValue = () => {
      setCategory(DEFAULT_VALUE.category)
      setProductStatus(DEFAULT_VALUE.productStatus)
      setLocation(DEFAULT_VALUE.location)
  }

  useEffect(() => {
      setLoading(true)
      clearTimeout(debounce)
      debounce = setTimeout(() => {
          getCategoryList({
              parent_id: category || null,
              type: productStatus || null,
              location
          }).then(resp => {
              if (resp.status === 200) {
                  setResultSearch(resp.data?.categoryListFound || [])
              }
              setLoading(false)
          })
      }, 500)
  }, [category, productStatus, location])

  return (
    <div className='filter'>
      <Collapse className='filter-layout' accordion style={{backgroundColor: '#e9e9e9'}} defaultActiveKey={1}>
            <Panel key={1} className='filter-container' header={<div className='filter-header'><div><Icon type="filter" theme="filled" />&nbsp;Bộ lọc</div></div>}>
              <FilterItem key={1} id={'category'} title={'Chọn danh mục'} options={[SELECT_ALL, ...categories?.list] || [SELECT_ALL]} setValue={setCategory} defaultValue={category}/>
              <FilterItem key={2} id={'location'} title={'Chọn quốc gia'} options={locationFilterList} setValue={setLocation} defaultValue={location}/>
              <FilterItem key={3} id={'type'} title={'Còn hàng'} options={typeFilterList} setValue={setProductStatus} defaultValue={productStatus}/>
            </Panel>
          </Collapse>
          <Button className='reset-filter-btn' type="primary" size='small' icon="reload" onClick={resetValue}>Reset</Button>
    </div>
  );
};
export default FilterLayout;
