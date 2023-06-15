import React from 'react';
import ListLayout from '../../../common/list-layout/ListLayout';
import BlogCard from './BlogCard';

const BlogLayout = ({blogList}) => {
  return (
    <section id='blog-layout'>
      <ListLayout titleCategory={'THỦ THUẬT FACEBOOK'} contentSeeMore={'Xem tất cả bài viết'}>
        {blogList?.map((blog) => <BlogCard key={blog.id} blogDetail={blog}/>)}
      </ListLayout>
    </section>
  );
};
export default BlogLayout;
