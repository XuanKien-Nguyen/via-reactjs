import React, { useState, useEffect, useContext } from 'react';
import FilterLayout from './components/filter/FilterLayout';
import ProductLayout from '../common/product/ProductLayout';
import Search from './components/Search';
import '../../../assets/scss/category.scss';
import { getParentCategoryList, getTypeList, getLocationListStocking } from '../../../services/category/category';
import { useTranslation } from 'react-i18next';
import { LayoutContext } from "../../../contexts";
import { useDispatch, useSelector } from "react-redux";

export default () => {

  const { t } = useTranslation()

  const query = new URLSearchParams(window.location.search);

  const categories = useSelector(store => store.categories)

  const { setLoading } = useContext(LayoutContext)

  const dispatch = useDispatch()

  const [resultSearch, setResultSearch] = useState([]);
  const [parentId, setParentId] = useState(null)
  const [typeList, setTypeList] = useState([])
  const [locationStockingList, setLocationStockingList] = useState([])

  useEffect(() => {
    setLoading(true)
    const id = query.get('id')
    if (id) {
      setParentId(id)
    }
    const init = async () => {
      if (!categories.called) {

        const respCategory = await getParentCategoryList();
        if (respCategory.status === 200) {
          const list = []
          const parentCategoryList = respCategory.data?.parentCategoryList || [];
          parentCategoryList.map(parentCategory => {
            const name = parentCategory.name
            list.push({ value: parentCategory.id, label: name })
          })
          dispatch({ type: 'SET_CATEGORIES', payload: list });
        }
      }

      const respLocationList = await getLocationListStocking();
      if (respLocationList.status === 200) {
        const locationList = respLocationList.data?.nationalFlagList || [];
        const list = []
        locationList.map(location => {
          list.push({ value: location.name, label: <div style={{ display: 'flex', alignItems: 'center' }}><img style={{ width: '20px', marginRight: '8px' }} src={location.path} alt="" className="src" />{location.name}</div> })
        })
        setLocationStockingList(list);
      }

      const respTypeList = await getTypeList();
      if (respTypeList.status === 200) {
        const typeLst = respTypeList.data?.CATEGORY_TYPE_LIST || [];
        const list = [{
          label: 'all',
          value: ''
        }]
        typeLst.map(type => {
          list.push({ label: type, value: type })
        });
        setTypeList(list);
      }
    }
    init()
  }, [])

  const getParentCategory = () => {
    return [{value: '', label: t('filter.all')}, ...categories?.list || [{value: '', label: t('filter.all')}]]
  }

  const getTypeStockList = () => {
    return typeList.map(el => ({
      label: t(`filter.${el.label}`),
      value: el.value
    }))
  }

  const getLocationStockingList = () => {
    return [{label: t('filter.all'), value: ''}, ...locationStockingList.map(el => ({
      label: el.label,
      value: el.value
    }))]
  }

  return (
    <div className='product-page layout-lg'>
      {/* <FilterLayout setResultSearch={setResultSearch} parentId={parentId} /> */}
      <Search setResultSearch={setResultSearch} parentId={parentId} getParentCategory={getParentCategory} getTypeStockList={getTypeStockList} getLocationStockingList={getLocationStockingList} />
      <div className='product-page_category'>
        {resultSearch.length === 0 ? <h1 style={{ marginTop: '40px' }} align={'center'}>{t('category.no-product')}</h1> : resultSearch.map((el, idx) => <ProductLayout key={idx} hiddenShowMore={true} categoryParent={el} />)}
      </div>
    </div>
  );
};
