import React, { useState, useEffect, useContext } from 'react';
import BlogLayout from '../homepage/components/blog/BlogLayout';
import Search from './component/Search';
import FilterItem from "../category/components/filter/FilterItem";
import { getPostListCommon } from '../../../services/post';
import { LayoutContext } from "../../../contexts";
import './index.scss';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE_OPTION = ['5', '10', '20', '30', '50']

export default () => {

  const { setLoading } = useContext(LayoutContext)

  const { t } = useTranslation();

  const [blogList, setBlogList] = useState([]);
  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [slug, setSlug] = useState('')

  const [reload, setReload] = useState(0)
  const [render, setRender] = useState(0)

  const [page, setPage] = useState({
    perpage: 20,
    currentPage: 1,
    total: 0
  })

  const getItems = () => {
    return [
      <FilterItem defaultValue={title}
        setValue={setTitle}
        type={'text'}
        title={t('filter.title')}
        allowClear={true} />,
      <FilterItem defaultValue={slug}
        setValue={setSlug}
        type={'text'}
        title={t('filter.slug')}
        allowClear={true} />,
      <FilterItem defaultValue={type} setValue={setType} options={getTypeList()} type={'select'}
        title={t('filter.type')} />,
    ]
  }

  const setupSearch = () => {
    const params = {
      title,
      type,
      slug,
      perpage: page.perpage,
      page: page.currentPage,
    }
    return {
      api: () => getPostListCommon(params),
      resolve: (resp, setPage) => {
        if (resp.status === 200) {
          setBlogList(resp?.data?.postList || [])
          setPage({
            perpage: resp.data.perPage,
            total: resp.data.postList.length,
            currentPage: resp.data.currentPage === 0 ? 1 : resp.data.currentPage
          })
        }
        setTimeout(() => {
          setRender(render + 1)
        }, 500)
      },
      reject: (err) => console.log(err)
    }
  }

  const getTypeList = () => {
    return [
      {
        label: t('blog_type.ALL'),
        value: ''
      },
      {
        label: t('blog_type.GUIDE'),
        value: 'guide'
      },
      {
        label: t('blog_type.TIP'),
        value: 'tip'
      }
    ]
  }

  const whenSizeChanged = () => {
    return (currentPage, perPage) => {
      setPage({
        perpage: perPage,
        currentPage: 1
      })
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const whenPageChanged = () => {
    return (currentPage, perPage) => {
      setPage({
        perpage: perPage,
        currentPage: currentPage
      })
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className='blog-page'>
      <div id={'blog-search'}>
        <Search items={getItems()}
          search={setupSearch()}
          loading={setLoading}
          setPage={setPage}
          state={[title, slug, type, reload]}
          onReset={() => {
            setTitle('')
            setSlug('')
            setType('')
          }}
          page={page} />
      </div>
      {blogList ?  <BlogLayout blogList={blogList} hiddenShowMore={true}/> : <div id={'blog-content'}>Không tìm thấy bài viết</div>}
      <div id={'blog-pagination'}>
        <Pagination defaultCurrent={1}
          current={page.currentPage}
          locale={{ items_per_page: `${t('order.records')}` }}
          total={page.total}
          pageSize={page.perpage}
          showSizeChanger
          onChange={whenPageChanged()}
          pageSizeOptions={PAGE_SIZE_OPTION}
          onShowSizeChange={whenSizeChanged()}
          showTotal={(total) => `${t('order.total_records')} ${total}`} />
      </div>
    </div>
  );
};
