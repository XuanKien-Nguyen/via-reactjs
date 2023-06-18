import React from 'react';
import BlogCard from './BlogCard';
import {useHistory} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BlogLayout = ({ blogList }) => {

  const history = useHistory();

  const {t} = useTranslation();

  return (
    <section id='blog-layout'>
      <div className='category-container'>
        <div className='category-title'>
          <h3 className='title-content'>
            <b>
              <div>{t('common.tricks').toUpperCase()}</div>
            </b>
            <a onClick={() => history.push(`/`)}>{t('common.view_all_blogs')}</a>
          </h3>
        </div>
        <div className='category-grid'>
          {blogList?.map((blog) => <BlogCard key={blog.id} blogDetail={blog} />)}
        </div>
      </div>
    </section>
  );
};
export default BlogLayout;
